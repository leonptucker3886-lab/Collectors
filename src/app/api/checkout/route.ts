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

    const commission = Math.round(price * 0.05 * 100);
    const sellerAmount = Math.round((price - price * 0.05) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title || 'Collectible Item',
              description: `Purchase from seller: ${sellerId}`,
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/marketplace/success?session_id={CHECKOUT_SESSION_ID}&listing=${listingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/marketplace/${listingId}`,
      metadata: {
        listingId,
        sellerId,
        buyerId,
        commission: commission.toString(),
        sellerAmount: sellerAmount.toString(),
      },
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
