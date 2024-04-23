// @ts-nocheck
import { parseWeight } from '../helpers/parse-weight';
import { IOrder, OrderStatus } from 'shipstation-node/typings/models';
import { expect, test, it } from 'vitest';
import { describe } from 'node:test';
import orderSample from './Orders/order-sample1.json';  
import orderSample2 from './Orders/order-sample2.json';
import orderSample3 from './Orders/order-sample3.json';
import orderSample4 from './Orders/order-sample4.json';



const orders = [...orderSample.orders, ...orderSample2.orders, ...orderSample3.orders, ...orderSample4.orders];

describe('parseWeight', () => {
  it('returns the weight as a float when found in internalNotes', () => {
    orders.forEach((order) => {
      expect(parseWeight(order)).toBeGreaterThanOrEqual(0);
    });
  });
  it('returns the correct weight for orderSample', () => {
    expect(parseWeight(orderSample.orders[0])).toBe(400);
  });

  it('returns the correct weight for orderSample2', () => {
    expect(parseWeight(orderSample2.orders[0])).toBe(425);
  });

  it('returns the correct weight for orderSample3', () => {
    expect(parseWeight(orderSample3.orders[0])).toBe(1000);
  });

  it('returns the correct weight for orderSample4', () => {
    expect(parseWeight(orderSample4.orders[0])).toBe(470);
  });
});