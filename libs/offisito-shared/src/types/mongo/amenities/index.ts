import { Document, ObjectId } from 'mongoose';

export enum AmenityAccess {
  free = 'free',
  payment = 'extra payment',
  member = 'membership',
}

export enum AmenityType {
  Building = 'Building',
  Floor = 'Floor',
  Kitchen = 'Kitchen',
  Asset = 'Asset',
}

export interface Amenity extends Document {
  _id: ObjectId;
  name: string;
  type: AmenityType;
}
