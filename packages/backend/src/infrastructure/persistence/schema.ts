import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const experiences = pgTable(
  'experiences',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    company: text('company').notNull(),
    role: text('role').notNull(),
    startDate: timestamp('start_date', { mode: 'date' }).notNull(),
    endDate: timestamp('end_date', { mode: 'date' }),
    description: text('description'),
    achievements: text('achievements').array().notNull().default([]),
    skills: text('skills').array().notNull().default([]),
    technologies: text('technologies').array().notNull().default([]),
    location: text('location'),
    employmentType: text('employment_type'),
    featured: boolean('featured').notNull().default(false),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('experiences_start_date_idx').on(table.startDate),
    index('experiences_featured_idx').on(table.featured),
  ]
);

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description').notNull(),
    shortDescription: text('short_description'),
    technologies: text('technologies').array().notNull().default([]),
    category: text('category').notNull(),
    tags: text('tags').array().notNull().default([]),
    githubUrl: text('github_url'),
    liveUrl: text('live_url'),
    godotWebExport: text('godot_web_export'),
    images: text('images').array().notNull().default([]),
    featured: boolean('featured').notNull().default(false),
    status: text('status').notNull().default('completed'),
    startDate: timestamp('start_date', { mode: 'date' }),
    endDate: timestamp('end_date', { mode: 'date' }),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('projects_slug_idx').on(table.slug),
    index('projects_category_idx').on(table.category),
    index('projects_featured_idx').on(table.featured),
  ]
);

export const blogPosts = pgTable(
  'blog_posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    category: text('category').notNull(),
    tags: text('tags').array().notNull().default([]),
    coverImage: text('cover_image'),
    published: boolean('published').notNull().default(false),
    publishedAt: timestamp('published_at', { mode: 'date' }),
    featured: boolean('featured').notNull().default(false),
    views: integer('views').notNull().default(0),
    readTime: integer('read_time'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('blog_posts_slug_idx').on(table.slug),
    index('blog_posts_category_idx').on(table.category),
    index('blog_posts_published_idx').on(table.published),
    index('blog_posts_published_at_idx').on(table.publishedAt),
    index('blog_posts_featured_idx').on(table.featured),
  ]
);

export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject'),
    message: text('message').notNull(),
    read: boolean('read').notNull().default(false),
    notes: text('notes'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('contact_submissions_read_idx').on(table.read),
    index('contact_submissions_created_at_idx').on(table.createdAt),
  ]
);

export const consultationSubmissions = pgTable(
  'consultation_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    company: text('company'),
    serviceType: text('service_type').notNull(),
    budget: text('budget'),
    timeline: text('timeline'),
    description: text('description').notNull(),
    read: boolean('read').notNull().default(false),
    notes: text('notes'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('consultation_submissions_read_idx').on(table.read),
    index('consultation_submissions_created_at_idx').on(table.createdAt),
  ]
);

export const adminUsers = pgTable(
  'admin_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    active: boolean('active').notNull().default(true),
    lastLoginAt: timestamp('last_login_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('admin_users_username_idx').on(table.username),
    uniqueIndex('admin_users_email_idx').on(table.email),
  ]
);
