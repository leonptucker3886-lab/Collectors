import { NextRequest, NextResponse } from 'next/server';

function getStripe() {
  const Stripe = require('stripe');
  return new Stripe(process.env.STRIPE_SECRET_KEY || '');
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    
    const body = await request.json();
    const { listingId, title, price, sellerId, buyerId, imageUrl } = body;

    if (!listingId || !price || !buyerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title || 'Collectible Item',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/collections?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/collections`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}