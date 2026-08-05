// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://steam-academy-xi.vercel.app',
	integrations: [
		starlight({
			title: 'STEAM Academy',
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'root',
			locales: {
				root: { label: "O'zbekcha", lang: 'uz' },
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/dhimmatovdev/steam-academy',
				},
			],
			sidebar: [
				{
					label: 'Computer Fundamentals',
					items: [{ autogenerate: { directory: 'computer-fundamentals' } }],
				},
				{
					label: 'Python Basic',
					items: [{ autogenerate: { directory: 'python-basic' } }],
				},
				{
					label: 'Python Intermediate',
					items: [{ autogenerate: { directory: 'python-intermediate' } }],
				},
				{
					label: 'Algorithms',
					items: [{ autogenerate: { directory: 'algorithms' } }],
				},
				{
					label: 'Git & GitHub',
					items: [{ autogenerate: { directory: 'git-github' } }],
				},
				{
					label: 'SQL',
					items: [{ autogenerate: { directory: 'sql' } }],
				},
				{
					label: 'Web Development',
					items: [{ autogenerate: { directory: 'web-development' } }],
				},
				{
					label: 'Robotics',
					items: [{ autogenerate: { directory: 'robotics' } }],
				},
				{
					label: 'AI Fundamentals',
					items: [{ autogenerate: { directory: 'ai-fundamentals' } }],
				},
			],
		}),
	],
});
