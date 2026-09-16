# Minimal static file server for local testing of the Origin & Order site.
# Exists only because this machine has no node and no real python; the
# deployed site is plain GitHub Pages and needs no server at all.

param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot),
  [int]$Port = 8123
)

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.ico'  = 'image/x-icon'
  '.md'   = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root on http://localhost:$Port/"

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
  } catch {
    break
  }
  $req = $context.Request
  $res = $context.Response

  $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
  if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
  $path = Join-Path $Root ($rel -replace '/', '\')

  # Never serve anything outside the root.
  $full = [System.IO.Path]::GetFullPath($path)
  $rootFull = [System.IO.Path]::GetFullPath($Root)
  if (-not $full.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
    $res.StatusCode = 403
    $res.Close()
    continue
  }

  if (Test-Path -LiteralPath $full -PathType Container) {
    $full = Join-Path $full 'index.html'
  }

  if (Test-Path -LiteralPath $full -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($full).ToLower()
    $ct = $mime[$ext]
    if (-not $ct) { $ct = 'application/octet-stream' }
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $res.ContentType = $ct
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    Write-Host "200 $rel"
  } else {
    $body = [System.Text.Encoding]::UTF8.GetBytes("404 not found: $rel")
    $res.StatusCode = 404
    $res.ContentType = 'text/plain; charset=utf-8'
    $res.OutputStream.Write($body, 0, $body.Length)
    Write-Host "404 $rel"
  }
  $res.Close()
}
