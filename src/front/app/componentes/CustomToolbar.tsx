import type { ToolbarProps } from "react-big-calendar";

type MyEvent = {
    title: string;
    start: Date;
    end: Date;
};

export default function CustomToolbar({ label }: ToolbarProps<MyEvent>) {
    return (
        <div className="hidden">{label}</div>
    );
}

