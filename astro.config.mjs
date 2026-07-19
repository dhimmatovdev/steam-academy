// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'STEAM Academy',
			customCss: ['./src/styles/custom.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/' },
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
				{
					label: 'Guides',
					items: [{ autogenerate: { directory: 'guides' } }],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
