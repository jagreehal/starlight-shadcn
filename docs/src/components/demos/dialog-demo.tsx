import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

export default function DialogDemo() {
	return (
		<DialogTrigger>
			<Button variant="outline">Open dialog</Button>
			<Dialog>
				<DialogHeader>
					<DialogTitle>Publish changes?</DialogTitle>
					<DialogDescription>
						Review your updates, then confirm to publish to the docs site.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter showCloseButton>
					<Button>Publish</Button>
				</DialogFooter>
			</Dialog>
		</DialogTrigger>
	);
}
