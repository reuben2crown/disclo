export function showToast(message: string, isError: boolean = false) {
    if (typeof window !== 'undefined' && (window as any).shopify?.toast) {
        (window as any).shopify.toast.show(message, { isError });
    }
}
