import { BaseSearchResult } from "../BaseSearchResult";

export const PetStates = [ 'alive', 'death', 'adopted', 'critical', 'wanted', 'ourpets' ];
export type PetState = typeof PetStates[number];

export const PetGenders = [ 'unset', 'female', 'male' ];
export type PetGender = typeof PetGenders[number];

export const PetTypes = [ 'cat', 'dog', 'unset' ];
export type PetType = typeof PetTypes[number];


export interface IPet {
    id: string;
    name: string;
    beforePhotoLink?: string;
    afterPhotoLink?: string;
    mdBody: string;
    mdShortBody: string;
    petState: PetState;
    gender: string;
    type: string;
}

export interface PetSearchResult extends BaseSearchResult<IPet> {}