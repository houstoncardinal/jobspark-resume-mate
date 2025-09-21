import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Globe, Navigation, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Comprehensive location data
const POPULAR_LOCATIONS = [
  // US Major Cities
  'New York, NY, USA',
  'Los Angeles, CA, USA', 
  'Chicago, IL, USA',
  'Houston, TX, USA',
  'Phoenix, AZ, USA',
  'Philadelphia, PA, USA',
  'San Antonio, TX, USA',
  'San Diego, CA, USA',
  'Dallas, TX, USA',
  'San Jose, CA, USA',
  'Austin, TX, USA',
  'Jacksonville, FL, USA',
  'Fort Worth, TX, USA',
  'Columbus, OH, USA',
  'Charlotte, NC, USA',
  'San Francisco, CA, USA',
  'Indianapolis, IN, USA',
  'Seattle, WA, USA',
  'Denver, CO, USA',
  'Boston, MA, USA',
  'Nashville, TN, USA',
  'Baltimore, MD, USA',
  'Oklahoma City, OK, USA',
  'Portland, OR, USA',
  'Las Vegas, NV, USA',
  'Milwaukee, WI, USA',
  'Albuquerque, NM, USA',
  'Tucson, AZ, USA',
  'Fresno, CA, USA',
  'Sacramento, CA, USA',
  'Kansas City, MO, USA',
  'Mesa, AZ, USA',
  'Atlanta, GA, USA',
  'Omaha, NE, USA',
  'Colorado Springs, CO, USA',
  'Raleigh, NC, USA',
  'Virginia Beach, VA, USA',
  'Miami, FL, USA',
  'Oakland, CA, USA',
  'Minneapolis, MN, USA',
  'Tulsa, OK, USA',
  'Wichita, KS, USA',
  'New Orleans, LA, USA',
  'Arlington, TX, USA',
  'Cleveland, OH, USA',
  'Bakersfield, CA, USA',
  'Tampa, FL, USA',
  'Aurora, CO, USA',
  'Honolulu, HI, USA',
  'Anaheim, CA, USA',
  'Santa Ana, CA, USA',
  'Corpus Christi, TX, USA',
  'Riverside, CA, USA',
  'St. Louis, MO, USA',
  'Lexington, KY, USA',
  'Pittsburgh, PA, USA',
  'Anchorage, AK, USA',
  'Stockton, CA, USA',
  'Cincinnati, OH, USA',
  'St. Paul, MN, USA',
  'Toledo, OH, USA',
  'Greensboro, NC, USA',
  'Newark, NJ, USA',
  'Plano, TX, USA',
  'Henderson, NV, USA',
  'Lincoln, NE, USA',
  'Buffalo, NY, USA',
  'Jersey City, NJ, USA',
  'Chula Vista, CA, USA',
  'Orlando, FL, USA',
  'Norfolk, VA, USA',

  // International Major Cities
  'London, England, UK',
  'Manchester, England, UK', 
  'Edinburgh, Scotland, UK',
  'Birmingham, England, UK',
  'Glasgow, Scotland, UK',
  'Liverpool, England, UK',
  'Leeds, England, UK',
  'Sheffield, England, UK',
  'Bristol, England, UK',
  'Cardiff, Wales, UK',
  'Belfast, Northern Ireland, UK',
  'Nottingham, England, UK',

  'Toronto, ON, Canada',
  'Vancouver, BC, Canada',
  'Montreal, QC, Canada',
  'Calgary, AB, Canada',
  'Edmonton, AB, Canada',
  'Ottawa, ON, Canada',
  'Winnipeg, MB, Canada',
  'Quebec City, QC, Canada',
  'Hamilton, ON, Canada',
  'Kitchener, ON, Canada',

  'Sydney, NSW, Australia',
  'Melbourne, VIC, Australia',
  'Brisbane, QLD, Australia',
  'Perth, WA, Australia',
  'Adelaide, SA, Australia',
  'Gold Coast, QLD, Australia',
  'Newcastle, NSW, Australia',
  'Canberra, ACT, Australia',
  'Sunshine Coast, QLD, Australia',
  'Wollongong, NSW, Australia',

  'Berlin, Germany',
  'Munich, Germany',
  'Hamburg, Germany',
  'Cologne, Germany',
  'Frankfurt, Germany',
  'Stuttgart, Germany',
  'Düsseldorf, Germany',
  'Dortmund, Germany',
  'Essen, Germany',
  'Leipzig, Germany',

  'Paris, France',
  'Marseille, France',
  'Lyon, France',
  'Toulouse, France',
  'Nice, France',
  'Nantes, France',
  'Strasbourg, France',
  'Montpellier, France',
  'Bordeaux, France',
  'Lille, France',

  'Amsterdam, Netherlands',
  'Rotterdam, Netherlands',
  'The Hague, Netherlands',
  'Utrecht, Netherlands',
  'Eindhoven, Netherlands',
  'Tilburg, Netherlands',
  'Groningen, Netherlands',
  'Almere, Netherlands',
  'Breda, Netherlands',
  'Nijmegen, Netherlands',

  'Madrid, Spain',
  'Barcelona, Spain',
  'Valencia, Spain',
  'Seville, Spain',
  'Zaragoza, Spain',
  'Málaga, Spain',
  'Murcia, Spain',
  'Palma, Spain',
  'Las Palmas, Spain',
  'Bilbao, Spain',

  'Rome, Italy',
  'Milan, Italy',
  'Naples, Italy',
  'Turin, Italy',
  'Palermo, Italy',
  'Genoa, Italy',
  'Bologna, Italy',
  'Florence, Italy',
  'Bari, Italy',
  'Catania, Italy',

  'Stockholm, Sweden',
  'Gothenburg, Sweden',
  'Malmö, Sweden',
  'Uppsala, Sweden',
  'Västerås, Sweden',
  'Örebro, Sweden',
  'Linköping, Sweden',
  'Helsingborg, Sweden',
  'Jönköping, Sweden',
  'Norrköping, Sweden',

  'Copenhagen, Denmark',
  'Aarhus, Denmark',
  'Odense, Denmark',
  'Aalborg, Denmark',
  'Esbjerg, Denmark',
  'Randers, Denmark',
  'Kolding, Denmark',
  'Horsens, Denmark',
  'Vejle, Denmark',
  'Roskilde, Denmark',

  'Oslo, Norway',
  'Bergen, Norway',
  'Stavanger, Norway',
  'Trondheim, Norway',
  'Drammen, Norway',
  'Fredrikstad, Norway',
  'Kristiansand, Norway',
  'Sandnes, Norway',
  'Tromsø, Norway',
  'Sarpsborg, Norway',

  'Helsinki, Finland',
  'Espoo, Finland',
  'Tampere, Finland',
  'Vantaa, Finland',
  'Oulu, Finland',
  'Turku, Finland',
  'Jyväskylä, Finland',
  'Lahti, Finland',
  'Kuopio, Finland',
  'Pori, Finland',

  'Zurich, Switzerland',
  'Geneva, Switzerland',
  'Basel, Switzerland',
  'Bern, Switzerland',
  'Lausanne, Switzerland',
  'Winterthur, Switzerland',
  'Lucerne, Switzerland',
  'St. Gallen, Switzerland',
  'Lugano, Switzerland',
  'Biel/Bienne, Switzerland',

  'Vienna, Austria',
  'Graz, Austria',
  'Linz, Austria',
  'Salzburg, Austria',
  'Innsbruck, Austria',
  'Klagenfurt, Austria',
  'Villach, Austria',
  'Wels, Austria',
  'Sankt Pölten, Austria',
  'Dornbirn, Austria',

  'Brussels, Belgium',
  'Antwerp, Belgium',
  'Ghent, Belgium',
  'Charleroi, Belgium',
  'Liège, Belgium',
  'Bruges, Belgium',
  'Namur, Belgium',
  'Leuven, Belgium',
  'Mons, Belgium',
  'Aalst, Belgium',

  'Dublin, Ireland',
  'Cork, Ireland',
  'Limerick, Ireland',
  'Galway, Ireland',
  'Waterford, Ireland',
  'Drogheda, Ireland',
  'Swords, Ireland',
  'Dundalk, Ireland',
  'Bray, Ireland',
  'Navan, Ireland',

  'Lisbon, Portugal',
  'Porto, Portugal',
  'Vila Nova de Gaia, Portugal',
  'Amadora, Portugal',
  'Braga, Portugal',
  'Funchal, Portugal',
  'Coimbra, Portugal',
  'Setúbal, Portugal',
  'Almada, Portugal',
  'Agualva-Cacém, Portugal',

  'Warsaw, Poland',
  'Kraków, Poland',
  'Łódź, Poland',
  'Wrocław, Poland',
  'Poznań, Poland',
  'Gdańsk, Poland',
  'Szczecin, Poland',
  'Bydgoszcz, Poland',
  'Lublin, Poland',
  'Katowice, Poland',

  'Prague, Czech Republic',
  'Brno, Czech Republic',
  'Ostrava, Czech Republic',
  'Plzen, Czech Republic',
  'Liberec, Czech Republic',
  'Olomouc, Czech Republic',
  'Ceske Budejovice, Czech Republic',
  'Hradec Kralove, Czech Republic',
  'Usti nad Labem, Czech Republic',
  'Pardubice, Czech Republic',

  'Budapest, Hungary',
  'Debrecen, Hungary',
  'Szeged, Hungary',
  'Miskolc, Hungary',
  'Pécs, Hungary',
  'Győr, Hungary',
  'Nyíregyháza, Hungary',
  'Kecskemét, Hungary',
  'Székesfehérvár, Hungary',
  'Szombathely, Hungary',

  'Bucharest, Romania',
  'Cluj-Napoca, Romania',
  'Timișoara, Romania',
  'Iași, Romania',
  'Constanța, Romania',
  'Craiova, Romania',
  'Brașov, Romania',
  'Galați, Romania',
  'Ploiești, Romania',
  'Oradea, Romania',

  'Sofia, Bulgaria',
  'Plovdiv, Bulgaria',
  'Varna, Bulgaria',
  'Burgas, Bulgaria',
  'Ruse, Bulgaria',
  'Stara Zagora, Bulgaria',
  'Pleven, Bulgaria',
  'Sliven, Bulgaria',
  'Dobrich, Bulgaria',
  'Shumen, Bulgaria',

  'Zagreb, Croatia',
  'Split, Croatia',
  'Rijeka, Croatia',
  'Osijek, Croatia',
  'Zadar, Croatia',
  'Slavonski Brod, Croatia',
  'Pula, Croatia',
  'Sesvete, Croatia',
  'Karlovac, Croatia',
  'Varaždin, Croatia',

  'Belgrade, Serbia',
  'Novi Sad, Serbia',
  'Niš, Serbia',
  'Kragujevac, Serbia',
  'Subotica, Serbia',
  'Novi Pazar, Serbia',
  'Zrenjanin, Serbia',
  'Pančevo, Serbia',
  'Čačak, Serbia',
  'Novi Beograd, Serbia',

  'Ljubljana, Slovenia',
  'Maribor, Slovenia',
  'Celje, Slovenia',
  'Kranj, Slovenia',
  'Velenje, Slovenia',
  'Koper, Slovenia',
  'Novo Mesto, Slovenia',
  'Ptuj, Slovenia',
  'Trbovlje, Slovenia',
  'Kamnik, Slovenia',

  'Bratislava, Slovakia',
  'Košice, Slovakia',
  'Prešov, Slovakia',
  'Žilina, Slovakia',
  'Banská Bystrica, Slovakia',
  'Nitra, Slovakia',
  'Trnava, Slovakia',
  'Martin, Slovakia',
  'Trenčín, Slovakia',
  'Poprad, Slovakia',

  // Special locations
  'Remote',
  'Remote - US Only',
  'Remote - EU Only',
  'Remote - Global',
  'Hybrid',
  'Flexible Location',
  'Multiple Locations',
  'Relocation Available'
];

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "City, state, or remote",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = POPULAR_LOCATIONS.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      // Show popular suggestions when empty
      setSuggestions(POPULAR_LOCATIONS.slice(0, 8));
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (value.length === 0) {
      setSuggestions(POPULAR_LOCATIONS.slice(0, 8));
    }
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay to allow for click events on suggestions
    setTimeout(() => setIsOpen(false), 150);
  };

  const clearInput = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Using a reverse geocoding service (you might want to implement your own)
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const location = `${data.city}, ${data.principalSubdivision}, ${data.countryName}`;
            onChange(location);
          } catch (error) {
            console.error('Failed to get location:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn("pl-10 pr-20", className)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearInput}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={detectLocation}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            title="Detect my location"
          >
            <Navigation className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div 
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {value.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
              Popular locations
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0",
                selectedIndex === index && "bg-blue-50 text-blue-600"
              )}
            >
              <div className="flex items-center gap-2">
                {suggestion.toLowerCase().includes('remote') ? (
                  <Globe className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
                <span className="text-sm">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};