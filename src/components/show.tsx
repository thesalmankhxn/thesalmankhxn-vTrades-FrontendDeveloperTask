interface ShowProps {
    when: boolean;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export function Show({ when, fallback = null, children }: ShowProps) {
    return when ? <>{children}</> : <>{fallback}</>;
}
