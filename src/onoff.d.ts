declare module 'onoff' {
    export interface GpioOptions {
        direction: 'in' | 'out';
        edge?: 'none' | 'falling' | 'rising' | 'both';
        activeLow?: boolean;
        debounceTimeout?: number;
        reconfigureDirection?: boolean;
    }

    export class Gpio {
        constructor(gpio: number, direction: 'in' | 'out', edge?: 'none' | 'falling' | 'rising' | 'both', options?: GpioOptions);
        read(callback: (err: Error | null, value: number) => void): void;
        write(value: number, callback?: (err: Error | null) => void): void;
        unexport(): void;
    }
}
