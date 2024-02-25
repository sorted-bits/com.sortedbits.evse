export class Log {
    public static d(message: string): void {
        console.log(message);
    }
    public static e(message: string): void {
        console.error(message);
    }
    public static i(message: string): void {
        console.info(message);
    }
    public static w(message: string): void {
        console.warn(message);
    }
}