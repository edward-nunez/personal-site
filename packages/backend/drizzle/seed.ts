import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import bcrypt from 'bcrypt';
import {
  adminUsers,
  experiences,
  projects,
  blogPosts,
  contactSubmissions,
  consultationSubmissions,
} from '../src/infrastructure/persistence/schema.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new pg.Pool({ connectionString });
const db = drizzle(pool);

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const [admin] = await db
    .insert(adminUsers)
    .values({
      username: 'admin',
      email: 'admin@edwardnunez.com',
      hashedPassword,
      firstName: 'Edward',
      lastName: 'Nunez',
      active: true,
    })
    .onConflictDoNothing({ target: adminUsers.username })
    .returning();
  console.log(`✅ Admin user created: ${admin?.username ?? 'already exists'}`);

  // Create sample experiences
  const [experience1] = await db
    .insert(experiences)
    .values({
      company: 'Cloud Corp',
      role: 'Senior DevSecOps Engineer',
      startDate: new Date('2022-01-01'),
      endDate: null,
      description:
        'Leading cloud infrastructure and security initiatives across multiple product teams.',
      achievements: [
        'Reduced deployment time by 60% through CI/CD pipeline optimization',
        'Implemented zero-trust security architecture across 50+ microservices',
        'Led migration from on-premise to Kubernetes, saving $200K annually',
      ],
      skills: ['Leadership', 'Architecture', 'Security', 'DevOps'],
      technologies: ['Kubernetes', 'Terraform', 'AWS', 'GitHub Actions', 'Docker', 'Prometheus'],
      location: 'Remote',
      employmentType: 'Full-time',
      featured: true,
      order: 1,
    })
    .returning();

  const [experience2] = await db
    .insert(experiences)
    .values({
      company: 'StartupX',
      role: 'Lead Software Engineer',
      startDate: new Date('2019-06-01'),
      endDate: new Date('2021-12-31'),
      description: 'Built and scaled the core platform from 0 to 100K users.',
      achievements: [
        'Architected microservices platform handling 10M+ requests/day',
        'Built real-time collaboration features using WebSockets',
        'Mentored team of 8 engineers across frontend and backend',
      ],
      skills: ['Full-Stack', 'System Design', 'Mentorship'],
      technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
      location: 'New York, NY',
      employmentType: 'Full-time',
      featured: true,
      order: 2,
    })
    .returning();
  console.log(`✅ Experiences created: ${experience1.company}, ${experience2.company}`);

  // Create sample projects
  const [project1] = await db
    .insert(projects)
    .values({
      title: 'Cloud Orchestrator',
      slug: 'cloud-orchestrator',
      description:
        'A Kubernetes-native deployment orchestration platform that automates multi-cloud infrastructure provisioning with built-in security scanning and compliance checks.',
      shortDescription: 'Multi-cloud deployment orchestration with security-first approach.',
      technologies: ['Go', 'Kubernetes', 'Terraform', 'React', 'gRPC'],
      category: 'DevOps',
      tags: ['cloud', 'kubernetes', 'infrastructure', 'security'],
      githubUrl: 'https://github.com/edwardnunez/cloud-orchestrator',
      liveUrl: 'https://cloud-orchestrator.dev',
      images: [],
      featured: true,
      status: 'completed',
      startDate: new Date('2023-03-01'),
      endDate: new Date('2023-09-01'),
      order: 1,
    })
    .onConflictDoNothing({ target: projects.slug })
    .returning();

  const [project2] = await db
    .insert(projects)
    .values({
      title: 'Space Explorer',
      slug: 'godot-space-explorer',
      description:
        'A lightweight browser-based space exploration game built with Godot Engine. Features procedural generation, physics-based movement, and a relaxing ambient soundtrack.',
      shortDescription: 'Browser-based space exploration game built with Godot.',
      technologies: ['Godot', 'GDScript', 'WebGL', 'HTML5'],
      category: 'Game',
      tags: ['godot', 'game-dev', 'webgl', 'procedural-generation'],
      githubUrl: 'https://github.com/edwardnunez/space-explorer',
      godotWebExport: '/games/space-explorer/index.html',
      images: [],
      featured: true,
      status: 'in-progress',
      startDate: new Date('2024-01-01'),
      order: 2,
    })
    .onConflictDoNothing({ target: projects.slug })
    .returning();

  const [project3] = await db
    .insert(projects)
    .values({
      title: 'Personal Site v2',
      slug: 'personal-site-v2',
      description:
        'This portfolio site — a full-stack application built with React, Express, PostgreSQL, and deployed on DigitalOcean Kubernetes with CI/CD.',
      shortDescription: 'Full-stack portfolio with admin panel and blog.',
      technologies: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Drizzle', 'Kubernetes'],
      category: 'Web',
      tags: ['portfolio', 'full-stack', 'clean-architecture'],
      githubUrl: 'https://github.com/edwardnunez/personal-site-v2',
      liveUrl: 'https://edwardnunez.com',
      images: [],
      featured: true,
      status: 'in-progress',
      startDate: new Date('2025-11-01'),
      order: 3,
    })
    .onConflictDoNothing({ target: projects.slug })
    .returning();
  console.log(
    `✅ Projects created: ${project1?.title ?? 'exists'}, ${project2?.title ?? 'exists'}, ${project3?.title ?? 'exists'}`,
  );

  // Create sample blog posts
  const [post1] = await db
    .insert(blogPosts)
    .values({
      title: 'Building Zero-Trust Security on Kubernetes',
      slug: 'building-zero-trust-kubernetes',
      content:
        '# Building Zero-Trust Security on Kubernetes\n\nIn this post, I walk through implementing a zero-trust security model across a Kubernetes cluster...\n\n## Why Zero-Trust?\n\nTraditional perimeter-based security assumes everything inside the network is trusted. Zero-trust flips this assumption.\n\n## Implementation Steps\n\n1. **Service Mesh**: Deploy Istio for mTLS between all services\n2. **Network Policies**: Kubernetes NetworkPolicy for pod-to-pod isolation\n3. **RBAC**: Fine-grained role-based access control\n4. **Secrets Management**: HashiCorp Vault integration\n\n## Results\n\n- 100% encrypted inter-service communication\n- Reduced attack surface by 80%\n- Automated compliance reporting',
      excerpt:
        'A practical guide to implementing zero-trust security across Kubernetes clusters with service mesh, network policies, and secrets management.',
      category: 'DevOps',
      tags: ['kubernetes', 'security', 'zero-trust', 'devops'],
      published: true,
      publishedAt: new Date('2025-08-15'),
      featured: true,
      views: 1240,
      readTime: 8,
    })
    .onConflictDoNothing({ target: blogPosts.slug })
    .returning();

  const [post2] = await db
    .insert(blogPosts)
    .values({
      title: 'Getting Started with Godot Web Exports',
      slug: 'getting-started-godot-web-export',
      content:
        '# Getting Started with Godot Web Exports\n\nGodot makes it incredibly easy to export your games for the web...\n\n## Setup\n\n1. Download Godot export templates\n2. Configure HTML5 export preset\n3. Build and deploy\n\n## Tips for Performance\n\n- Keep asset sizes small\n- Use texture compression\n- Lazy load audio\n\n## Embedding in React\n\nYou can embed Godot web exports in a React app using an iframe with proper sandboxing.',
      excerpt:
        'Learn how to export Godot games for the web and embed them in modern web applications.',
      category: 'Godot Development',
      tags: ['godot', 'game-dev', 'web', 'tutorial'],
      published: true,
      publishedAt: new Date('2025-10-01'),
      featured: false,
      views: 890,
      readTime: 5,
    })
    .onConflictDoNothing({ target: blogPosts.slug })
    .returning();
  console.log(
    `✅ Blog posts created: ${post1?.title ?? 'exists'}, ${post2?.title ?? 'exists'}`,
  );

  // Create sample contact submission
  await db.insert(contactSubmissions).values({
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Project Inquiry',
    message:
      'Hi Edward, I am interested in discussing a potential cloud architecture project. Would you be available for a call next week?',
    read: false,
  });
  console.log('✅ Sample contact submission created');

  // Create sample consultation submission
  await db.insert(consultationSubmissions).values({
    name: 'Bob Johnson',
    email: 'bob@techcorp.com',
    company: 'TechCorp Inc.',
    serviceType: 'Cloud Architecture',
    budget: '$10,000 - $25,000',
    timeline: '3-6 months',
    description:
      'We need help migrating our legacy monolith to a microservices architecture on AWS. Current stack is Java/Spring Boot with MySQL.',
    read: false,
  });
  console.log('✅ Sample consultation submission created');

  console.log('\n🎉 Database seeding complete!');
}

main()
  .then(async () => {
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await pool.end();
    process.exit(1);
  });
