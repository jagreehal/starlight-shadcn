import { Button } from '@/components/ui/button';

export default function ButtonDemo() {
	return (
		<>
			<Button>Default</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
		</>
	);
}
