import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, updateDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const { listingId, sellerId, buyerId, commission, sellerAmount } = session.metadata || {};

    if (listingId) {
      try {
        await updateDoc(doc(db, 'listings', listingId), {
          status: 'sold',
          soldAt: serverTimestamp(),
          buyerId,
          stripeSessionId: session.id,
        });

        await addDoc(collection(db, 'transactions'), {
          type: 'sale',
          listingId,
          sellerId,
          buyerId,
          amount: (session.amount_total || 0) / 100,
          commission: parseFloat(commission || '0'),
          sellerAmount: parseFloat(sellerAmount || '0'),
          stripeSessionId: session.id,
          status: 'completed',
          createdAt: serverTimestamp(),
        });

        console.log('Payment completed for listing:', listingId);
      } catch (error) {
        console.error('Error updating listing:', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
