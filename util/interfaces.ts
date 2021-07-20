export interface cardInformation{
  filePath: string;
  Name: string;
  _id: string;
  Type: 'Spell' | 'Minion' | 'Weapon';
  Class: 'Neutral'|'Druid'|'Hunter'|'Mage'|'Paladin'|'Priest'|'Rogue'|'Shaman'|'Warlock'|'Warrior';
  Rarity: 'Basic' | 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Token';
  'Card Set': 'Basic' | 'Classic' | 'Curse of Naxxramas' | 'Goblins vs Gnomes' | 'Blackrock Mountain' | 'The Grand Tournament' | 'League of Explorers';
  Subtype?: string;
  Cost: number;
  Attack?: number;
  Health?: number;
  'Token Type'?: string;
  Keywords?:string;
  Textbox?:string;
}