import { useState } from 'react';
import SmallSearch from './SmallSearch';

const Syntax = () =>{

  const [query, setQuery] = useState<String>('');
  
  interface syntaxInfo{
    term:string;
    shortcut:string;
    description:string;
    allowed?:Array<string>;
  }

  const syntaxGuide:Array<syntaxInfo>=[
    {
      term: 'Name',
      shortcut: 'n, none',
      description: 'The name of the card'
    },
    {
      term: 'Rarity',
      shortcut: 'r',
      description: 'The rarity of the card',
      allowed: [
        'Basic (b)',
        'Common (c)',
        'Rare (r)',
        'Epic (e)',
        'Legendary (l)'
      ]
    },
    {
      term: 'Class',
      shortcut: 'c',
      description: 'The class of the card',
      allowed: ['Neutral', 'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior']
    },
    {
      term: 'Set',
      shortcut: 's',
      description: 'The set the card released in',
      allowed: [
        'Basic',
        'Classic',
        'Naxxramas, Curse of Naxxramas (Naxx)',
        'Goblins vs Gnomes (GVG)',
        'Blackrock Mountain (BRM)',
        'The Grand Tournament (TGT)',
        'The League of Explorers (LOE)'
      ]
    },
    {
      term: 'Type',
      shortcut: 't',
      description: 'The type of the card.',
      allowed:[
        'Minion',
        'Weapon',
        'Spell'
      ]
    },
    {
      term: 'Tribe',
      shortcut: 't',
      description: 'The tribe of the minion.',
      allowed:[
        'Murloc',
        'Pirate',
        'Dragon',
        'Mech',
        'Demon',
        'Beast',
        'Totem'
      ]
    },
    {
      term: 'Token Type',
      shortcut: 't',
      description: 'The token family of the card. Must be combined with u:true for results to appear.',
      allowed:[
        'Invention',
        'Dream',
        'Power Chord',
        'Spare Part',
        'Basic Totem'
      ]
    },
    {
      term: 'Mana Cost',
      shortcut: 'm',
      description: 'The mana cost to play the card. Supports <, >, >=, <=, and = operations.',
      allowed:['Any positive number.']
    },
    {
      term: 'Attack',
      shortcut: 'a',
      description: 'The attack of the minion/weapon. Supports <, >, >=, <=, and = operations.',
      allowed:['Any positive number.']
    },
    {
      term: 'Health',
      shortcut: 'h',
      description: 'The health of the minion, or durability of the weapon. Supports <, >, >=, <=, and = operations.',
      allowed:['Any positive number.']
    },
    {
      term: 'Keywords',
      shortcut: 'k',
      description: 'Any bolded keywords that appear on the card.',
      allowed:[
        "Battlecry",
        "Charge",
        "Choose One",
        "Combo",
        "Deathrattle",
        "Divine Shield",
        "Enrage",
        "Inspire",
        "Overload",
        "Secret",
        "Silence",
        "Spell Damage",
        "Stealth",
        "Taunt",
        "Windfury"
      ]
    },
    {
      term: 'Card Effect',
      shortcut: 'e',
      description: 'The primary text box of the card.'
    },
    {
      term: 'Uncollectible',
      shortcut: 'u',
      description: 'Allow generated tokens to appear in your search. Defaults to false if not included.',
      allowed:['true']
    },
    {
      term: 'Or',
      shortcut: 'OR, ||',
      description: 'Search for one attribute or another. (Works well with grouping!)',
      allowed:[
        'Example - c:mage OR c:hunter',
        'Example - c:mage || c:hunter'
      ]
    },
    {
      term: 'String',
      shortcut: '""',
      description: 'Search a term using a value with a space in it',
      allowed:['Example - e:"Freeze a Minion"']
    },
    {
      term: 'Group',
      shortcut: '()',
      description: 'Group together several terms as a logical requirement',
      allowed:[
        'Example - (c:mage OR c:hunter)',
        'Example - (a>3 h>3)'
      ]
    },
  ];

  const allowedTermsMap = (term) => {
    if(typeof term?.allowed!=='undefined'){
      return term.allowed.map((allowed,index)=>{
        return(
          <p key={`${term.term}-allowed-${index}`}>{allowed}</p>
        );
      })
    } else {return null}
  }

  return (
    <div className='bg-blue-400 min-w-screen min-h-screen flex justify-center'>
      <div className="my-8 p-4 rounded-lg h-full bg-white shadow-md sm:flex-row w-screen md:w-auto">
        <div className='flex flex-col items-center'>
          <div className='w-3/6 pb-2'>
            <SmallSearch
              type='search'
              query={query}
              setQuery={setQuery}
            />
          </div>
        </div>
        <div className='flex flex-row pr-2 overflow-x-scroll'>
          <table className='px-2 table-auto md:table-fixed w-auto'>
            <thead>
              <tr>
                <th>Term</th>
                <th>Shortcut</th>
                <th className='w-auto md:w-72'>Description</th>
                <th>Allowed Values (or examples)</th>
              </tr>
            </thead>
            <tbody>
              {syntaxGuide.map((term)=>{
                return (
                  <tr key={term.term}>
                    {/* I don't know why, but at non-even screen sizes the left most border wasn't showing up */}
                    {/*  Hence the border-l-2 */}
                    <td className='p-2 border border-1 border-l-2 border-gray-400' >
                      {term.term}
                    </td>
                    <td className='p-2 border border-1 border-gray-400' >
                      {term.shortcut}
                    </td>
                    <td className='p-2 border border-1 border-gray-400' >
                      {term.description}
                    </td>
                    <td className='p-2 border border-1 border-gray-400' >
                      {allowedTermsMap(term)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  )
}

export default Syntax;