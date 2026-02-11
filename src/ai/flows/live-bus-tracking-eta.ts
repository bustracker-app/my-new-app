'use server';
/**
 * @fileOverview This file defines a Genkit flow for calculating the estimated time of arrival (ETA) of a school bus.
 *
 * - calculateBusEta - A function that calculates the ETA of a bus to a specific stop.
 * - CalculateBusEtaInput - The input type for the calculateBusEta function.
 * - CalculateBusEtaOutput - The return type for the calculateBusEta function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateBusEtaInputSchema = z.object({
  busLocationLatitude: z.number().describe('The latitude of the bus.'),
  busLocationLongitude: z.number().describe('The longitude of the bus.'),
  busSpeed: z.number().describe('The speed of the bus in km/h.'),
  stopLatitude: z.number().describe('The latitude of the bus stop.'),
  stopLongitude: z.number().describe('The longitude of the bus stop.'),
  routeName: z.string().describe('The route name of the bus.'),
});
export type CalculateBusEtaInput = z.infer<typeof CalculateBusEtaInputSchema>;

const CalculateBusEtaOutputSchema = z.object({
  etaMinutes: z.number().describe('The estimated time of arrival in minutes.'),
  distanceKm: z.number().describe('The distance to the stop in kilometers.'),
});
export type CalculateBusEtaOutput = z.infer<typeof CalculateBusEtaOutputSchema>;

export async function calculateBusEta(input: CalculateBusEtaInput): Promise<CalculateBusEtaOutput> {
  return calculateBusEtaFlow(input);
}

const calculateBusEtaPrompt = ai.definePrompt({
  name: 'calculateBusEtaPrompt',
  input: {schema: CalculateBusEtaInputSchema},
  output: {schema: CalculateBusEtaOutputSchema},
  prompt: `You are a transportation assistant that calculates the estimated time of arrival (ETA) of a school bus to a specific stop.

Given the current location of the bus (latitude: {{busLocationLatitude}}, longitude: {{busLocationLongitude}}), its speed ({{busSpeed}} km/h), and the location of the stop (latitude: {{stopLatitude}}, longitude: {{stopLongitude}}), calculate the ETA in minutes and the distance to the stop in kilometers. The route name is {{routeName}}.

Consider that the bus may not be traveling in a straight line and may encounter traffic or other delays.

Return the ETA in minutes and the distance to the stop in kilometers.
`,
});

const calculateBusEtaFlow = ai.defineFlow(
  {
    name: 'calculateBusEtaFlow',
    inputSchema: CalculateBusEtaInputSchema,
    outputSchema: CalculateBusEtaOutputSchema,
  },
  async input => {
    const {output} = await calculateBusEtaPrompt(input);
    return output!;
  }
);
