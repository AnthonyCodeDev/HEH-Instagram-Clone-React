/**
 * Déclarations de types pour les bibliothèques sans types officiels
 */

declare module 'sockjs-client' {
    class SockJS {
        constructor(url: string, _reserved?: any, options?: any);
        close(code?: number, reason?: string): void;
        send(data: string): void;

        onopen: ((ev: Event) => any) | null;
        onmessage: ((ev: MessageEvent) => any) | null;
        onclose: ((ev: CloseEvent) => any) | null;
        onerror: ((ev: Event) => any) | null;

        readyState: number;
        protocol: string;
        url: string;

        static CONNECTING: number;
        static OPEN: number;
        static CLOSING: number;
        static CLOSED: number;
    }

    export default SockJS;
}
