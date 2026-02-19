{{/*
Expand the name of the chart.
*/}}
{{- define "personal-site.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "personal-site.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "personal-site.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels - follows Kubernetes recommended labels
*/}}
{{- define "personal-site.labels" -}}
helm.sh/chart: {{ include "personal-site.chart" . }}
{{ include "personal-site.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- if .Values.commonLabels }}
{{ toYaml .Values.commonLabels }}
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "personal-site.selectorLabels" -}}
app.kubernetes.io/name: {{ include "personal-site.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Component-specific labels - used for labeling specific components
Usage: {{ include "personal-site.componentLabels" (dict "component" "backend" "context" $) }}
*/}}
{{- define "personal-site.componentLabels" -}}
{{ include "personal-site.labels" .context }}
app.kubernetes.io/component: {{ .component }}
{{- end }}

{{/*
Component selector labels
Usage: {{ include "personal-site.componentSelectorLabels" (dict "component" "backend" "context" $) }}
*/}}
{{- define "personal-site.componentSelectorLabels" -}}
{{ include "personal-site.selectorLabels" .context }}
app.kubernetes.io/component: {{ .component }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "personal-site.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "personal-site.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Component-specific service account name
Usage: {{ include "personal-site.componentServiceAccountName" (dict "component" "backend" "context" $) }}
*/}}
{{- define "personal-site.componentServiceAccountName" -}}
{{- if (index .context.Values .component).serviceAccount.create }}
{{- default (printf "%s-%s" (include "personal-site.fullname" .context) .component) (index .context.Values .component).serviceAccount.name }}
{{- else }}
{{- default "default" (index .context.Values .component).serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Return the proper image name
Usage: {{ include "personal-site.image" (dict "image" .Values.backend.image "context" $) }}
*/}}
{{- define "personal-site.image" -}}
{{- $registry := "" }}
{{- if hasKey .image "registry" }}
  {{- $registry = .image.registry }}
{{- else }}
  {{- $registry = .context.Values.global.imageRegistry }}
{{- end }}
{{- $repository := .image.repository | required "image.repository is required" }}
{{- $tag := .image.tag | default .context.Chart.AppVersion | toString }}
{{- if $registry }}
{{- printf "%s/%s:%s" $registry $repository $tag }}
{{- else }}
{{- printf "%s:%s" $repository $tag }}
{{- end }}
{{- end }}

{{/*
Return the proper image pull policy
*/}}
{{- define "personal-site.imagePullPolicy" -}}
{{- $policy := .pullPolicy | default .context.Values.global.imagePullPolicy }}
{{- default "IfNotPresent" $policy }}
{{- end }}

{{/*
Generate standard security context
*/}}
{{- define "personal-site.securityContext" -}}
runAsNonRoot: true
runAsUser: 1000
fsGroup: 1000
{{- end }}

{{/*
Generate container security context
*/}}
{{- define "personal-site.containerSecurityContext" -}}
allowPrivilegeEscalation: false
capabilities:
  drop:
  - ALL
readOnlyRootFilesystem: false
runAsNonRoot: true
runAsUser: 1000
{{- end }}

{{/*
Database URL for PostgreSQL
*/}}
{{- define "personal-site.databaseUrl" -}}
{{- if .Values.postgresql.enabled }}
{{- printf "postgresql://%s:%s@%s:%d/%s?schema=public" .Values.postgresql.auth.username .Values.postgresql.auth.password (include "personal-site.postgresql.serviceName" .) (.Values.postgresql.port | int) .Values.postgresql.database }}
{{- else }}
{{- .Values.postgresql.externalDatabaseUrl | required "postgresql.externalDatabaseUrl is required when postgresql.enabled is false" }}
{{- end }}
{{- end }}

{{/*
PostgreSQL service name
*/}}
{{- define "personal-site.postgresql.serviceName" -}}
{{- printf "%s-postgresql" (include "personal-site.fullname" .) }}
{{- end }}

{{/*
Ollama service name
*/}}
{{- define "personal-site.ollama.serviceName" -}}
{{- printf "%s-ollama" (include "personal-site.fullname" .) }}
{{- end }}

{{/*
Backend service name
*/}}
{{- define "personal-site.backend.serviceName" -}}
{{- printf "%s-backend" (include "personal-site.fullname" .) }}
{{- end }}

{{/*
Frontend service name
*/}}
{{- define "personal-site.frontend.serviceName" -}}
{{- printf "%s-frontend" (include "personal-site.fullname" .) }}
{{- end }}

{{/*
FitSync service name
*/}}
{{- define "personal-site.fitSync.serviceName" -}}
{{- printf "%s-fit-sync" (include "personal-site.fullname" .) }}
{{- end }}

{{/*
API secret name (backend, fit-sync, postgresql)
*/}}
{{- define "personal-site.apiSecretName" -}}
{{- default "io-edwardnunez-api-secrets" .Values.secrets.apiSecretName }}
{{- end }}

{{/*
Frontend secret name
*/}}
{{- define "personal-site.frontendSecretName" -}}
{{- default "io-edwardnunez-secrets" .Values.secrets.frontendSecretName }}
{{- end }}

{{/*
Generate .dockercfg for image pull secret
*/}}
{{- define "personal-site.dockercfg" -}}
{
  "{{ .Values.imagePullSecrets.registry }}": {
    "username": "{{ .Values.imagePullSecrets.username }}",
    "password": "{{ .Values.imagePullSecrets.password }}",
    "email": "{{ .Values.imagePullSecrets.email }}",
    "auth": "{{ printf "%s:%s" .Values.imagePullSecrets.username .Values.imagePullSecrets.password | b64enc }}"
  }
}
{{- end }}

{{/*
Generate dockerconfigjson format for image pull secrets (modern format)
Expects the secret item context with .registry, .username, .password, .email
*/}}
{{- define "personal-site.dockerconfigjson" -}}
{
  "auths": {
    "{{ .registry }}": {
      "username": "{{ .username }}",
      "password": "{{ .password }}",
      "email": "{{ .email }}",
      "auth": "{{ printf "%s:%s" .username .password | b64enc }}"
    }
  }
}
{{- end }}
