import { Badge } from '@/design-system/components';

const skillCategories = [
  {
    title: 'DevSecOps & Cloud',
    skills: [
      'Kubernetes',
      'Docker',
      'Terraform',
      'AWS',
      'DigitalOcean',
      'CI/CD',
      'GitHub Actions',
      'Security Automation',
      'Infrastructure as Code',
    ],
  },
  {
    title: 'Backend Development',
    skills: [
      'Node.js',
      'TypeScript',
      'Express.js',
      'PostgreSQL',
      'Drizzle ORM',
      'REST APIs',
      'GraphQL',
      'Microservices',
    ],
  },
  {
    title: 'Frontend Development',
    skills: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'React Query',
      'Zustand',
      'Responsive Design',
      'Web Performance',
    ],
  },
  {
    title: 'Tools & Practices',
    skills: [
      'Git',
      'Linux',
      'Bash/Shell Scripting',
      'Monitoring & Logging',
      'Agile/Scrum',
      'Code Review',
      'Technical Documentation',
      'Problem Solving',
    ],
  },
];

export function SkillsMatrix() {
  return (
    <section className="section bg-bg-secondary">
      <div className="container-wide">
        <h2 className="text-3xl font-bold tracking-tight text-fg mb-12 text-center">
          Skills & Technologies
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {skillCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <h3 className="text-xl font-semibold text-fg">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill} variant="default">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
