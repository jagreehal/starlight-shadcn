import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function FormControlsDemo() {
	return (
		<div className="grid w-full max-w-xl gap-3">
			<Input aria-label="Project name" placeholder="Project name" />
			<Textarea aria-label="Project description" placeholder="Short description" />
			<Select defaultSelectedKey="starter">
				<SelectTrigger aria-label="Select project tier">
					<SelectValue>Select a tier</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem id="starter">Starter</SelectItem>
					<SelectItem id="pro">Pro</SelectItem>
					<SelectItem id="enterprise">Enterprise</SelectItem>
				</SelectContent>
			</Select>
			<div className="flex flex-wrap items-center gap-6">
				<Checkbox>Email updates</Checkbox>
				<Switch>Public project</Switch>
			</div>
		</div>
	);
}
