/**
 * Catch-all API Route for Comunidades
 * Path: /api/comunidades/*
 *
 * Captura todas as rotas não implementadas e retorna JSON válido.
 * NUNCA retorna 404 HTML.
 */

import { NextRequest, NextResponse } from 'next/server';

function handleRequest(request: NextRequest): NextResponse {
  const { pathname } = new URL(request.url);

  console.warn(`[API] Unimplemented route accessed: ${request.method} ${pathname}`);

  return NextResponse.json(
    {
      success: false,
      error: 'Endpoint não implementado',
      path: pathname,
      method: request.method,
      hint: 'Esta rota ainda não foi implementada no sistema de Comunidades.',
    },
    { status: 501 }
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}
