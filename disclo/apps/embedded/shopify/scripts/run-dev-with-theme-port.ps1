# Use when theme extension port 9293 is already taken (another `shopify app dev`).
param(
    [int] $ThemeExtensionPort = 9294,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $ShopifyArgs = @()
)
$env:SHOPIFY_DEV_THEME_APP_EXTENSION_PORT = "$ThemeExtensionPort"
Set-Location (Join-Path $PSScriptRoot "..")
if ($ShopifyArgs.Count -gt 0) {
    pnpm dev -- @ShopifyArgs
} else {
    pnpm dev
}
