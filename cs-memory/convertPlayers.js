import fs from 'fs';

// Wklej tutaj całą listę zawodników z nagłówkiem (pierwsza linia)
const rawData = `
Player	Teams	Maps	Rounds	K-D Diff	K/D	Rating
3.0
ZywOo	Vitality	46	1032	+192	1.31	1.26
zweih	PARIVISION	36	835	-47	0.92	1.00
ztr	GamerLegion	20	443	-63	0.80	0.88
yxngstxr	HEROIC	19	398	-51	0.81	0.89
yuurih	FURIA	35	774	+3	1.01	1.07
YEKINDAR	FURIA	35	774	+14	1.03	1.10
xiELO	PARIVISION	23	527	+20	1.06	1.09
xfl0ud	HEROIC	19	398	-8	0.97	1.04
xertioN	MOUZ	24	542	+38	1.10	1.18
XANTARES	Aurora	29	655	+57	1.13	1.19
woxic	Aurora	29	655	+20	1.05	1.01
Wicadia	Aurora	29	655	+45	1.10	1.15
w0nderful	Natus Vincere	21	459	+84	1.32	1.20
ultimate	Liquid	19	404	-38	0.86	0.87
Twistzz	FaZe	23	461	+18	1.06	1.12
torzsi	MOUZ	24	542	+38	1.12	1.03
tN1R	Spirit	29	685	-21	0.95	0.98
TeSeS	Falcons	39	874	-100	0.82	0.91
Techno	The MongolZ	24	523	-7	0.98	0.95
Tauson	GamerLegion	28	619	+31	1.08	1.03
SunPayus	G2	18	384	+18	1.08	1.02
Staehr	Astralis	26	577	-48	0.89	1.01
Spinx	MOUZ	24	542	+20	1.06	1.08
snow	paiN	34	770	-27	0.95	1.00
siuhy	Liquid	19	404	-62	0.79	0.89
sh1ro	Spirit	29	685	+159	1.44	1.18
saadzin	Legacy	26	596	+72	1.20	1.07
ropz	Vitality	46	1032	+136	1.22	1.16
REZ	GamerLegion	28	619	+32	1.08	1.11
PR	GamerLegion	26	573	+38	1.10	1.17
nqz	paiN	34	770	+57	1.12	1.02
npl	B8	28	614	+6	1.01	1.05
nota	PARIVISION	23	527	+14	1.04	1.12
nilo	HEROIC	19	398	+25	1.10	1.09
NiKo	Falcons	39	874	+51	1.09	1.10
nicx	Passion UA	18	395	-32	0.88	0.95
NertZ	Liquid	19	404	-3	0.99	1.02
NAF	Liquid	19	404	-7	0.97	1.02
n1ssim	Legacy	26	596	+13	1.03	1.06
mzinho	The MongolZ	24	523	+23	1.07	1.06
molodoy	FURIA	35	774	+129	1.27	1.13
mezii	Vitality	46	1032	+6	1.01	1.05
MATYS	G2	18	384	-15	0.94	1.04
malbsMd	G2	18	384	-38	0.86	0.96
makazze	Natus Vincere	21	459	-5	0.98	1.10
Maka	3DMAX	19	388	-16	0.94	0.96
MAJ3R	Aurora	29	655	-76	0.82	0.88
Magisk	Astralis	24	542	+5	1.01	1.02
m0NESY	Falcons	39	874	+197	1.38	1.26
lux	Legacy	26	596	-45	0.89	0.94
Lucky	3DMAX	19	388	-14	0.95	1.00
latto	Legacy	26	596	+25	1.07	1.10
kyxsan	Falcons	39	874	-56	0.90	1.02
kyousuke	Falcons	31	694	+52	1.11	1.12
Kvem	Passion UA	18	395	-24	0.92	1.03
KSCERATO	FURIA	35	774	+80	1.17	1.19
kensizor	B8	28	614	+8	1.02	1.11
karrigan	FaZe	23	461	-81	0.75	0.84
JT	Passion UA	18	395	-43	0.85	1.01
jottAAA	Aurora	26	585	-53	0.87	0.94
Jimpphat	MOUZ	24	542	+17	1.05	1.02
jcobbb	FaZe	23	461	-9	0.97	1.04
Jame	PARIVISION	23	527	+65	1.25	1.04
jabbi	Astralis	26	577	-25	0.94	1.00
iM	Natus Vincere	21	459	+27	1.09	1.12
hypex	GamerLegion	28	619	+16	1.04	0.95
HooXi	Astralis	26	577	-77	0.81	0.94
HeavyGod	G2	18	384	+22	1.09	1.11
headtr1ck	B8	28	614	+5	1.01	0.94
hallzerk	Passion UA	18	395	-38	0.86	0.90
Grim	Passion UA	18	395	-30	0.90	0.95
Graviti	3DMAX	19	388	-31	0.89	0.94
frozen	FaZe	23	461	+26	1.09	1.12
flameZ	Vitality	46	1032	-24	0.97	1.09
FalleN	FURIA	35	774	-86	0.83	0.88
Ex3rcice	3DMAX	19	388	-17	0.94	0.99
esenthial	B8	28	614	-16	0.96	1.01
EliGE	Liquid	19	404	-31	0.90	0.97
dumau	Legacy	26	596	+20	1.05	1.07
donk	Spirit	29	685	+134	1.29	1.31
dgt	paiN	32	721	-5	0.99	1.00
device	Astralis	21	475	+1	1.00	0.95
dav1deuS	paiN	32	721	-36	0.93	0.98
controlez	The MongolZ	24	523	+1	1.00	1.06
chopper	Spirit	26	624	-99	0.76	0.84
Brollan	MOUZ	24	542	-62	0.83	0.88
broky	FaZe	23	461	+21	1.08	1.00
bodyy	3DMAX	19	388	-9	0.97	1.07
bLitz	The MongolZ	24	523	-43	0.88	0.92
biguzera	paiN	34	770	-9	0.98	1.05
BELCHONOKK	PARIVISION	23	527	-33	0.91	1.00
b1t	Natus Vincere	21	459	+31	1.11	1.06
apEX	Vitality	46	1032	-185	0.74	0.82
alex666	B8	28	614	-7	0.98	1.00
Aleksib	Natus Vincere	21	459	-47	0.84	0.93
910	The MongolZ	24	523	+72	1.22	1.12`

// Podział na linie i pominięcie nagłówka
const lines = rawData.trim().split('\n').slice(1);

const players = lines
  .map(line => line.trim())
  .filter(line => line.length > 0) // pomija puste linie
  .map(line => {
    const parts = line.split(/\t/);
    if (parts.length < 7) {
      console.warn('Pominięto linię (za mało pól):', line);
      return null;
    }

    const [name, team, maps, rounds, kdDiff, kd, rating] = parts;

    return {
      name: name.trim(),
      team: team.trim(),
      maps: Number(maps),
      rounds: Number(rounds),
      kdDiff: Number(kdDiff.replace('+', '')),
      kd: Number(kd),
      rating: Number(rating)
    };
  })
  .filter(p => p !== null); // usuwa null z mapowania

// Zapis do JSON
fs.writeFileSync('players.json', JSON.stringify(players, null, 2));
console.log(`Zapisano players.json z ${players.length} zawodnikami ✅`);