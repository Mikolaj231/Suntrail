import React, { useState, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import logo from './uzdr.png';
import L from 'leaflet'; /* do mapy */
import markersData from './markersData'; /* Baza danych uzdrowisk */
import details from './detailInfo';
import './App.css';

const center = [52.0, 19.0]; /* do mapy , pocz wsp */

/* marker przycisk */
const customMarkerIcon = L.divIcon({
  className: 'custom-marker'
});

/* Funkcja dla gwizdek ratingu i opinii */
function StarRating({ rating }) {
  const roundedRating = Math.round(rating);
  let opinion = '';

  switch (roundedRating) {
    case 1:
      opinion = 'Bardzo negatywna';
      break;
    case 2:
      opinion = 'Negatywna';
      break;
    case 3:
      opinion = 'Średnia';
      break;
    case 4:
      opinion = 'Dobra';
      break;
    case 5:
      opinion = 'Bardzo dobra';
      break;
    default:
      opinion = 'Brak opinii';
  }

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<span key={i}>&#9733;</span>);
    } else {
      stars.push(<span key={i}>&#9734;</span>);
    }
  }

  return (
    <div>
      {stars}
      <p>Opinia: {opinion}</p>
    </div>
  );
}

/* Funkcja do galerii zdjęć */
function GalleryItem({ image, description }) {
  return (
    <div className="gallery-item">
      <img src={image} alt="Gallery" className="gallery-image" />
      <p className="gallery-description">{description}</p>
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null); 
  const detailsRef = useRef(null);
  const mapRef = useRef(null);

  const filteredMarkers = markersData.filter(marker =>
    marker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetails = (marker) => {
    const detailsForMarker = details.find(detail => detail.name === marker.name);
    setSelectedDetails(detailsForMarker);
    setSelectedMarker(marker);
    setShowDetails(true);
  
    // Upewnienie się, że detailsRef.current nie jest nullem przed wywołaniem scrollIntoView
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }


  const closeDetails = () => {
    setSelectedMarker(null);
    setShowDetails(false);
    mapRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);
  

  return (
    <div className="App">
      <header className="App-header">

        {/* Górny panel */}
        <div className="gornypanel">
          <img src={logo} alt="Logo" className="logo" />
          <p className="nameAp">Uzdrowiska - Polska</p>
        </div>

        {/* opis góny*/}
        <div className="tekstopis">
          <p className="opis">
            <b>Zapraszamy do odwiedzenia uzdrowiska, gdzie zdrowie i relaks spotykają się w harmonii z pięknem przyrody. Odkryj miejsce, umysł i duszę tworzy niepowtarzalną atmosferę regeneracji.<br />
              Pozwól sobie na chwilę wytchnienia, ciesząc się korzyściami zdrowotnymi i urokami malowniczego otoczenia.</b>
          </p>

          <p className="wybor">
            <h3>Wybierz uzdrowisko na mapie</h3>
          </p>

          {/* wyszukiwarka uzdrowisk*/}
          <p className="wyszukaj">
            <form onSubmit={e => e.preventDefault()} className="form">
              <input type="text" placeholder="Wpisz nazwę uzdrowiska" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input" />
              <button type="submit" className="button">Szukaj</button>
            </form>
          </p>

        </div>

        {/* mapa*/}
        <div className="mapaContainer" style={{ marginTop: '-10px', marginBottom: '60px' }} ref={mapRef}>
          <MapContainer
            center={center}
            zoom={6}
            style={{ width: '1000px', height: '650px' }}
          >
            <TileLayer
              url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=UbFwd08uo4DcXd29jIYP"
              attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            />
            {filteredMarkers.map((marker, index) => (
              <Marker key={index} position={marker.position} icon={customMarkerIcon}>
                <Popup closeOnClick={true}>
                  <div>
                    <h2>{marker.name}</h2>
                    <p><strong>Adres:</strong> {marker.address}</p>
                    <p><strong>Telefon:</strong> {marker.phoneNumber}</p>
                    <p><strong>Ocena:</strong> <StarRating rating={marker.rating} /></p>
                    <span className="details-link" onClick={() => openDetails(marker)}>Szczególne informacje</span><br />
                    <a href={marker.link} target="_blank" rel="noopener noreferrer" className="details-link">Więcej informacji</a><br />
                    <br /><img src={marker.image} alt={marker.name} style={{ width: '200px' }} />
                  </div>




                </Popup>

              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* panel info */}
        <div className="tekstopisuzdro">
          <p className="text-info">
            <h2>Dlaczego warto odwiedzić uzdrowiska, które oferujemy?</h2>
            <br />Uzdrowiska oferują nie tylko relaksujący pobyt w pięknych okolicznościach przyrody, ale także wiele korzyści zdrowotnych.<br />
            Wizyta w uzdrowisku może pomóc w poprawie zdrowia psychicznego i fizycznego, a także zapewnić wsparcie w procesie rekonwalescencji po chorobach.<br />
            <br />Znajdź swoje idealne uzdrowisko i ciesz się korzyściami, jakie ma do zaoferowania!<br />
          </p>
        </div>

        {/* panel z galerią zdjęć */}
        <div className="gallery-container">
          <GalleryItem
            image="https://u.profitroom.pl/2018.sanatorium.augustow.pl/thumb/0x900/uploads/DJI_0637.JPG"
          />
          <p className="Augustow">
            BiaVita Polska S.A. Sanatorium Uzdrowiskowe Augustów
          </p>
          <p className="opisaugustuw">
            Jednym z takich uzdrowisk, które gorąco polecamy do odwiedzenia, jest Sanatorium Uzdrowiskowe Augustów.<br />
            Zlokalizowane w sercu Puszczy Augustowskiej, w otoczeniu dziewięciu jezior, niemal nad samym jeziorem Necko, zapewnia niezwykłe doświadczenie harmonii z przyrodą.<br />
            <br />To miejsce oferuje nowoczesne udogodnienia, w tym przeszklony basen z unikalnym widokiem na park zdrojowy.
            Sanatorium jest w pełni przystosowane do potrzeb osób niepełnosprawnych, zapewniając komfortowy pobyt wszystkim gościom.<br />
            <br />Posiada 54 klimatyzowane pokoje z balkonami, wyposażone w telewizory LCD, lodówki, zestawy do kawy i herbaty oraz dostęp do Wi-Fi.<br />
            Dumą obiektu jest Cafe & Bar Nad Jeziorem, z którego okien roztacza się malowniczy widok na Jezioro Necko.<br />
            <br />Strefa Medical SPA oferuje program rehabilitacji, obejmujący szczegółowe badania lekarskie,
            konsultacje lekarzy specjalistów oraz ponad 50 rodzajów profesjonalnych zabiegów z zakresu hydroterapii, krioterapii, kinezyterapii, fizykoterapii i balneologii.
            Dodatkowo, zaprasza do skorzystania z strefy Wellness, która oferuje basen z bicze wodne i hydromasażem, różnorodne zabiegi odnowy biologicznej oraz sauny japońską, parową i infrared.<br />
            <br />Augustów Medical SPA specjalizuje się w leczeniu chorób ortopedyczno-urazowych, reumatologicznych, naczyń obwodowych, osteoporozy oraz w podnoszeniu odporności.
            Personel składa się z wykwalifikowanych lekarzy, pielęgniarek, fizjoterapeutów, dietetyków oraz psychologów, którzy dbają o zdrowie i dobre samopoczucie gości.<br />
            <br />Oprócz szerokiej oferty rehabilitacyjnej, proponujemy wiele dodatkowych atrakcji, takich jak wypożyczalnia rowerów turystycznych, kijków do nordic walking,
            sprzętu wodnego oraz leżaki na plaży. Zapraszamy do skorzystania z naszych pakietów leczniczych, które obejmują różnorodne zabiegi oraz komfortowy pobyt w malowniczej okolicy.<br />
            <br />Sanatorium Uzdrowiskowe Augustów to idealne miejsce na relaks, rekreację oraz poprawę zdrowia i kondycji fizycznej. Jesteśmy przekonani,
            że będzie to niezapomniane doświadczenie dla każdego, kto zdecyduje się odwiedzić to urokliwe miejsce.<br />
          </p>
        </div>

        {showDetails && selectedDetails && (
          <div ref={detailsRef} className="details-panel">
            <button className="close-btn" onClick={closeDetails}>Zamknij informację oraz wróć do mapy</button>
            <h2>{selectedMarker.name}</h2>
            <p><strong>Adres:</strong> {selectedMarker.address}</p>
            <p><strong>Telefon:</strong> {selectedMarker.phoneNumber}</p>
            <p><strong>Ocena:</strong> <StarRating rating={selectedMarker.rating} /></p>
            <p>{selectedMarker.description}</p>
            {/* Wyświetl dodatkowe informacje na temat uzdrowiska */}
            <p><strong>Dlaczego warto:</strong> {selectedDetails.dlaczegowarto}</p>
            <img src={selectedMarker.image} alt={selectedMarker.name} />
          </div>
        )}

        {/* Dolny panel */}
        <div className="dolnypanel">
          <p className="copyright">
            Copyright © 2024 | Stworzono przez PRz team L7
          </p>
        </div>

      </header>
    </div>
  );
}

export default App;
