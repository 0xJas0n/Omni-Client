import 'react';

declare module 'react' {
    interface HTMLAttributes<T> {
        variant?: string;
    }
}
