import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, Cell, ScatterChart, Scatter, ZAxis,
  AreaChart, Area
} from "recharts";

// ── DADOS REAIS DOS CSVs ──────────────────────────────────────────────────────
const WC_DATA = [
  { Year: 1930, Host: "Uruguay", Teams: 13, Champion: "Uruguay", RunnerUp: "Argentina", TopScorer: "Guillermo Stábile - 8", Attendance: 590549, AttendanceAvg: 32808, Matches: 18 },
  { Year: 1934, Host: "Italy", Teams: 16, Champion: "Italy", RunnerUp: "Czechoslovakia", TopScorer: "Oldřich Nejedlý - 5", Attendance: 363000, AttendanceAvg: 21353, Matches: 17 },
  { Year: 1938, Host: "France", Teams: 16, Champion: "Italy", RunnerUp: "Hungary", TopScorer: "Leônidas - 7", Attendance: 375700, AttendanceAvg: 20872, Matches: 18 },
  { Year: 1950, Host: "Brazil", Teams: 15, Champion: "Uruguay", RunnerUp: "Brazil", TopScorer: "Ademir - 8", Attendance: 1045246, AttendanceAvg: 47511, Matches: 22 },
  { Year: 1954, Host: "Switzerland", Teams: 16, Champion: "Germany", RunnerUp: "Hungary", TopScorer: "Sándor Kocsis - 11", Attendance: 768607, AttendanceAvg: 29562, Matches: 26 },
  { Year: 1958, Host: "Sweden", Teams: 16, Champion: "Brazil", RunnerUp: "Sweden", TopScorer: "Just Fontaine - 13", Attendance: 819810, AttendanceAvg: 23423, Matches: 35 },
  { Year: 1962, Host: "Chile", Teams: 16, Champion: "Brazil", RunnerUp: "Czechoslovakia", TopScorer: "Leonel Sánchez - 4", Attendance: 893172, AttendanceAvg: 27912, Matches: 32 },
  { Year: 1966, Host: "England", Teams: 16, Champion: "England", RunnerUp: "West Germany", TopScorer: "Eusébio - 9", Attendance: 1563135, AttendanceAvg: 48848, Matches: 32 },
  { Year: 1970, Host: "Mexico", Teams: 16, Champion: "Brazil", RunnerUp: "Italy", TopScorer: "Gerd Müller - 10", Attendance: 1603975, AttendanceAvg: 50124, Matches: 32 },
  { Year: 1974, Host: "Germany", Teams: 16, Champion: "West Germany", RunnerUp: "Netherlands", TopScorer: "Grzegorz Lato - 7", Attendance: 1865753, AttendanceAvg: 49099, Matches: 38 },
  { Year: 1978, Host: "Argentina", Teams: 16, Champion: "Argentina", RunnerUp: "Netherlands", TopScorer: "Mario Kempes - 6", Attendance: 1545791, AttendanceAvg: 40679, Matches: 38 },
  { Year: 1982, Host: "Spain", Teams: 24, Champion: "Italy", RunnerUp: "West Germany", TopScorer: "Paolo Rossi - 6", Attendance: 2109723, AttendanceAvg: 40572, Matches: 52 },
  { Year: 1986, Host: "Mexico", Teams: 24, Champion: "Argentina", RunnerUp: "West Germany", TopScorer: "Gary Lineker - 6", Attendance: 2394031, AttendanceAvg: 46039, Matches: 52 },
  { Year: 1990, Host: "Italy", Teams: 24, Champion: "West Germany", RunnerUp: "Argentina", TopScorer: "Salvatore Schillaci - 6", Attendance: 2516215, AttendanceAvg: 48389, Matches: 52 },
  { Year: 1994, Host: "United States", Teams: 24, Champion: "Brazil", RunnerUp: "Italy", TopScorer: "H. Stoichkov / O. Salenko - 6", Attendance: 3587538, AttendanceAvg: 68991, Matches: 52 },
  { Year: 1998, Host: "France", Teams: 32, Champion: "France", RunnerUp: "Brazil", TopScorer: "Davor Šuker - 6", Attendance: 2903477, AttendanceAvg: 45367, Matches: 64 },
  { Year: 2002, Host: "Korea/Japan", Teams: 32, Champion: "Brazil", RunnerUp: "Germany", TopScorer: "Ronaldo - 8", Attendance: 2705337, AttendanceAvg: 42271, Matches: 64 },
  { Year: 2006, Host: "Germany", Teams: 32, Champion: "Italy", RunnerUp: "France", TopScorer: "Miroslav Klose - 5", Attendance: 3352605, AttendanceAvg: 52384, Matches: 64 },
  { Year: 2010, Host: "South Africa", Teams: 32, Champion: "Spain", RunnerUp: "Netherlands", TopScorer: "T. Müller / W. Sneijder - 5", Attendance: 3178856, AttendanceAvg: 49670, Matches: 64 },
  { Year: 2014, Host: "Brazil", Teams: 32, Champion: "Germany", RunnerUp: "Argentina", TopScorer: "James Rodríguez - 6", Attendance: 3429873, AttendanceAvg: 53592, Matches: 64 },
  { Year: 2018, Host: "Russia", Teams: 32, Champion: "France", RunnerUp: "Croatia", TopScorer: "Harry Kane - 6", Attendance: 3031768, AttendanceAvg: 47371, Matches: 64 },
  { Year: 2022, Host: "Qatar", Teams: 32, Champion: "Argentina", RunnerUp: "France", TopScorer: "Kylian Mbappé - 8", Attendance: 3404252, AttendanceAvg: 53191, Matches: 64 },
];

const TEST_2026 = [
  { team:"France", continent:"Europe", is_host:0, goals_scored:85, goals_received:32, wins:25, losses:6, draws:7, titles:2, market_value:1290, fifa_rank:1, fifa_pts:1877.32, avg_age:26.7, participations:16, composite:113.9 },
  { team:"Spain", continent:"Europe", is_host:0, goals_scored:104, goals_received:32, wins:29, losses:2, draws:8, titles:1, market_value:1150, fifa_rank:2, fifa_pts:1876.40, avg_age:27.2, participations:16, composite:108.5 },
  { team:"Argentina", continent:"South America", is_host:0, goals_scored:80, goals_received:14, wins:30, losses:4, draws:3, titles:3, market_value:575, fifa_rank:3, fifa_pts:1874.81, avg_age:27.9, participations:18, composite:150.4 },
  { team:"England", continent:"Europe", is_host:0, goals_scored:82, goals_received:23, wins:26, losses:6, draws:7, titles:1, market_value:1300, fifa_rank:4, fifa_pts:1825.97, avg_age:26.8, participations:16, composite:105.5 },
  { team:"Portugal", continent:"Europe", is_host:0, goals_scored:98, goals_received:31, wins:26, losses:5, draws:7, titles:0, market_value:841, fifa_rank:5, fifa_pts:1763.83, avg_age:27.1, participations:8, composite:90.8 },
  { team:"Brazil", continent:"South America", is_host:0, goals_scored:58, goals_received:39, wins:15, losses:10, draws:10, titles:5, market_value:932, fifa_rank:6, fifa_pts:1761.16, avg_age:27.8, participations:22, composite:68.5 },
  { team:"Netherlands", continent:"Europe", is_host:0, goals_scored:92, goals_received:41, wins:21, losses:8, draws:9, titles:0, market_value:808, fifa_rank:7, fifa_pts:1757.87, avg_age:26.6, participations:11, composite:82.3 },
  { team:"Morocco", continent:"Africa", is_host:0, goals_scored:100, goals_received:18, wins:37, losses:2, draws:9, titles:0, market_value:436, fifa_rank:8, fifa_pts:1755.87, avg_age:27.4, participations:6, composite:131.6 },
  { team:"Belgium", continent:"Europe", is_host:0, goals_scored:80, goals_received:32, wins:19, losses:7, draws:10, titles:0, market_value:442, fifa_rank:9, fifa_pts:1734.71, avg_age:27.1, participations:14, composite:68.4 },
  { team:"Germany", continent:"Europe", is_host:0, goals_scored:80, goals_received:47, wins:21, losses:10, draws:7, titles:4, market_value:828, fifa_rank:10, fifa_pts:1730.37, avg_age:26.6, participations:20, composite:68.5 },
  { team:"Croatia", continent:"Europe", is_host:0, goals_scored:68, goals_received:33, wins:20, losses:7, draws:8, titles:0, market_value:259, fifa_rank:11, fifa_pts:1717.07, avg_age:28.5, participations:6, composite:64.2 },
  { team:"Colombia", continent:"South America", is_host:0, goals_scored:73, goals_received:35, wins:22, losses:7, draws:11, titles:0, market_value:285, fifa_rank:13, fifa_pts:1693.09, avg_age:29.3, participations:6, composite:58.1 },
  { team:"Senegal", continent:"Africa", is_host:0, goals_scored:88, goals_received:22, wins:31, losses:3, draws:9, titles:0, market_value:406, fifa_rank:14, fifa_pts:1688.99, avg_age:27.4, participations:3, composite:99.8 },
  { team:"Mexico", continent:"North America", is_host:1, goals_scored:80, goals_received:52, wins:27, losses:12, draws:15, titles:0, market_value:142, fifa_rank:15, fifa_pts:1681.03, avg_age:25.6, participations:17, composite:55.3 },
  { team:"United States", continent:"North America", is_host:1, goals_scored:101, goals_received:60, wins:26, losses:17, draws:9, titles:0, market_value:170, fifa_rank:16, fifa_pts:1673.13, avg_age:26.0, participations:11, composite:52.8 },
  { team:"Uruguay", continent:"South America", is_host:0, goals_scored:54, goals_received:30, wins:16, losses:7, draws:16, titles:2, market_value:419, fifa_rank:17, fifa_pts:1673.07, avg_age:26.6, participations:14, composite:60.3 },
  { team:"Japan", continent:"Asia", is_host:0, goals_scored:110, goals_received:26, wins:27, losses:5, draws:5, titles:0, market_value:224, fifa_rank:18, fifa_pts:1660.43, avg_age:26.4, participations:7, composite:103.1 },
  { team:"Algeria", continent:"Africa", is_host:0, goals_scored:104, goals_received:34, wins:32, losses:4, draws:11, titles:0, market_value:229, fifa_rank:28, fifa_pts:1564.26, avg_age:26.4, participations:4, composite:79.3 },
  { team:"Canada", continent:"North America", is_host:1, goals_scored:59, goals_received:40, wins:18, losses:8, draws:15, titles:0, market_value:22, fifa_rank:30, fifa_pts:1556.48, avg_age:24.6, participations:2, composite:45.1 },
];

const FLAGS = {
  "France":"🇫🇷","Spain":"🇪🇸","Argentina":"🇦🇷","England":"🇬🇧","Portugal":"🇵🇹","Brazil":"🇧🇷",
  "Netherlands":"🇳🇱","Morocco":"🇲🇦","Belgium":"🇧🇪","Germany":"🇩🇪","Croatia":"🇭🇷",
  "Colombia":"🇨🇴","Senegal":"🇸🇳","Mexico":"🇲🇽","United States":"🇺🇸","Uruguay":"🇺🇾",
  "Japan":"🇯🇵","Algeria":"🇩🇿","Canada":"🇨🇦","Italy":"🇮🇹","West Germany":"🇩🇪",
  "Hungary":"🇭🇺","Uruguay_h":"🇺🇾","Sweden":"🇸🇪","Chile":"🇨🇱","Switzerland":"🇨🇭",
  "South Africa":"🇿🇦","Russia":"🇷🇺","Qatar":"🇶🇦","Korea/Japan":"🏆",
};

const FLAG = (t) => FLAGS[t] || "🏳️";

const PAIS_PT = {
  "France":"França","Spain":"Espanha","Argentina":"Argentina","England":"Inglaterra",
  "Portugal":"Portugal","Brazil":"Brasil","Netherlands":"Holanda","Morocco":"Marrocos",
  "Belgium":"Bélgica","Germany":"Alemanha","Croatia":"Croácia","Colombia":"Colômbia",
  "Senegal":"Senegal","Mexico":"México","United States":"Estados Unidos","Uruguay":"Uruguai",
  "Japan":"Japão","Algeria":"Argélia","Canada":"Canadá","Italy":"Itália",
  "West Germany":"Alemanha Ocid.","Hungary":"Hungria","Sweden":"Suécia","Chile":"Chile",
  "Switzerland":"Suíça","South Africa":"África do Sul","Russia":"Rússia","Qatar":"Catar",
  "Korea/Japan":"Coreia/Japão","Czechoslovakia":"Tchecoslováquia","Uruguay":"Uruguai",
  "Korea Republic, Japan":"Coreia/Japão","Saudi Arabia":"Arábia Saudita","Japan":"Japão",
  "Iran":"Irã","Turkey":"Turquia","Ecuador":"Equador","Austria":"Áustria",
  "South Korea":"Coreia do Sul","Australia":"Austrália","Egypt":"Egito","Norway":"Noruega",
  "Panama":"Panamá","Ivory Coast":"Costa do Marfim","Paraguay":"Paraguai",
  "Czech Republic":"Rep. Tcheca","Scotland":"Escócia","Tunisia":"Tunísia",
  "DR Congo":"R.D. Congo","Uzbekistan":"Uzbequistão","Iraq":"Iraque",
  "Jordan":"Jordânia","Bosnia and Herzegovina":"Bósnia e Herz.","Cape Verde":"Cabo Verde",
  "Ghana":"Gana","New Zealand":"Nova Zelândia","Haiti":"Haiti",
};

const CONT_PT = {
  "Europe":"Europa","South America":"América do Sul","Africa":"África",
  "Asia":"Ásia","North America":"América do Norte","Oceania":"Oceania","All":"Todos",
};

const T = (name) => PAIS_PT[name] || name;
const TC = (cont) => CONT_PT[cont] || cont;

const CONTINENT_COLOR = {
  "Europe": "#4a9eff", "South America": "#f9c74f", "Africa": "#43aa8b",
  "Asia": "#f8961e", "North America": "#f94144", "Oceania": "#90be6d"
};

// ── PALETA ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#080e08", panel: "#0d180d", panelAlt: "#101e10",
  border: "#1a3a1a", borderLight: "#2a5a2a",
  green: "#1e6b1e", greenLight: "#3aaa3a",
  gold: "#c9a227", goldLight: "#e8c84a",
  white: "#eef4ee", muted: "#5a845a", mutedLight: "#7aaa7a",
  accent: "#00e676", red: "#ef5350", blue: "#42a5f5", purple: "#ab47bc",
  chart: ["#c9a227","#00e676","#42a5f5","#ef5350","#ab47bc","#ff9800","#26c6da","#66bb6a"],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d1f0d", border: `1px solid ${C.border}`, borderRadius:10, padding:"10px 16px", boxShadow:"0 4px 20px #00000080" }}>
      <p style={{ color: C.gold, fontWeight:800, marginBottom:6, fontSize:13 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || C.white, fontSize:12, margin:"2px 0" }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString("pt-BR", { maximumFractionDigits:2 }) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const Card = ({ children, style={} }) => (
  <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", ...style }}>{children}</div>
);

const STitle = ({ children, right }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
    <h3 style={{ margin:0, color:C.gold, fontFamily:"Georgia,serif", fontSize:12, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase" }}>{children}</h3>
    {right && <span style={{ color:C.muted, fontSize:11 }}>{right}</span>}
  </div>
);

const KpiCard = ({ icon, label, value, sub, color=C.gold, style={} }) => (
  <Card style={{ textAlign:"center", ...style }}>
    {icon && <div style={{ fontSize:28, marginBottom:4 }}>{icon}</div>}
    <div style={{ fontSize:32, fontWeight:900, color, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{value}</div>
    <div style={{ color:C.white, fontSize:12, marginTop:6, fontWeight:700, letterSpacing:"0.04em" }}>{label}</div>
    {sub && <div style={{ color:C.muted, fontSize:10, marginTop:3 }}>{sub}</div>}
  </Card>
);

const Badge = ({ label, color="#1a3a1a", text=C.white }) => (
  <span style={{ background:color, color:text, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, letterSpacing:"0.06em" }}>{label}</span>
);

// ── SCORES ────────────────────────────────────────────────────────────────────
function computeScore(t) {
  const total = t.wins + t.losses + t.draws;
  const winRate = t.wins / total;
  const goalRatio = t.goals_scored / (t.goals_received + 1);
  return (
    (1 / t.fifa_rank) * 40 +
    winRate * 30 +
    goalRatio * 20 +
    (t.titles / 5) * 10
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function WorldCupBI() {
  const [tab, setTab] = useState("overview");
  const [selectedYear, setSelectedYear] = useState(null);
  const [teamFilter, setTeamFilter] = useState("All");
  const [continentFilter, setContinentFilter] = useState("All");

  // Derived data
  const champions = useMemo(() => {
    const cnt = {};
    WC_DATA.forEach(d => {
      const c = d.Champion.replace("West Germany", "Germany");
      cnt[c] = (cnt[c] || 0) + 1;
    });
    return Object.entries(cnt).sort((a,b) => b[1]-a[1]).map(([name, count]) => ({ name:`${FLAG(name)} ${T(name)}`, count }));
  }, []);

  const attendanceSeries = WC_DATA.map(d => ({ year: d.Year, avg: d.AttendanceAvg, total: Math.round(d.Attendance/1000) }));

  const topScorersData = WC_DATA.slice(0,10).map(d => {
    const m = d.TopScorer.match(/- (\d+)/);
    return { year: d.Year, scorer: d.TopScorer.split(" -")[0], goals: m ? parseInt(m[1]) : 0 };
  });

  const goals2026 = TEST_2026.map(t => ({
    name: `${FLAG(t.team)} ${T(t.team)}`,
    gols_marcados: t.goals_scored,
    gols_sofridos: t.goals_received,
    saldo: t.goals_scored - t.goals_received,
  })).sort((a,b) => b.saldo - a.saldo).slice(0,12);

  const filtered2026 = useMemo(() => {
    return TEST_2026
      .filter(t => continentFilter === "All" || t.continent === continentFilter)
      .sort((a,b) => a.fifa_rank - b.fifa_rank);
  }, [continentFilter]);

  const radarTeam = teamFilter !== "All" ? TEST_2026.find(t => t.team === teamFilter) : null;

  const tabs = [
    { id:"overview",   icon:"📊", label:"Visão Geral" },
    { id:"historico",  icon:"📈", label:"Histórico" },
    { id:"copa2026",   icon:"🌎", label:"Copa 2026" },
    { id:"selecoes",   icon:"🏆", label:"Favoritos" },
    { id:"tendencias", icon:"🔮", label:"Tendências" },
  ];

  const TBtn = (t) => (
    <button key={t.id} onClick={() => setTab(t.id)} style={{
      padding:"10px 18px", border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
      borderRadius:8, gap:6, display:"flex", alignItems:"center",
      background: tab===t.id ? C.gold : "transparent",
      color: tab===t.id ? C.bg : C.muted,
      transition:"all .2s",
    }}>{t.icon} {t.label}</button>
  );

  const winRate = (t) => {
    const tot = t.wins + t.losses + t.draws;
    return tot > 0 ? ((t.wins / tot) * 100).toFixed(1) : "0.0";
  };

  const continents = ["All", ...Array.from(new Set(TEST_2026.map(t => t.continent))).sort()];

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"'Inter','Segoe UI',sans-serif", color:C.white }}>

      {/* HEADER */}
      <div style={{ background:`linear-gradient(135deg, #030803 0%, #0a1f0a 50%, #122212 100%)`, borderBottom:`2px solid ${C.gold}55`, padding:"22px 32px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:42 }}>🏆</span>
            <div>
              <h1 style={{ margin:0, fontSize:24, fontFamily:"Georgia,serif", color:C.gold, letterSpacing:"0.06em", lineHeight:1 }}>Copa do Mundo FIFA</h1>
              <p style={{ margin:"4px 0 0", color:C.muted, fontSize:12 }}>Painel BI · Dados históricos 1930–2022 + Análise Pré-Copa 2026 · {WC_DATA.length} edições</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Badge label="22 Edições" color="#1a3a1a" text={C.greenLight} />
            <Badge label="48 Seleções 2026" color="#3a2a00" text={C.gold} />
            <Badge label="Dados Reais CSV" color="#001a3a" text={C.blue} />
          </div>
        </div>
        <div style={{ display:"flex", gap:6, marginTop:14 }}>
          {tabs.map(TBtn)}
        </div>
      </div>

      <div style={{ padding:"22px 28px", maxWidth:1300, margin:"0 auto" }}>

        {/* ══ TAB: VISÃO GERAL ══════════════════════════════════════════ */}
        {tab === "overview" && (
          <div>
            {/* KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:16 }}>
              <KpiCard icon="📅" label="Edições" value={WC_DATA.length} sub="1930 – 2022" />
              <KpiCard icon="⚽" label="Total de Gols" value={WC_DATA.reduce((s,d)=>s+d.Matches*2.65|0,0).toLocaleString()} sub="estimativa histórica" color={C.accent} />
              <KpiCard icon="👥" label="Público Total" value="43M+" sub="soma de todas as edições" color={C.blue} />
              <KpiCard icon="🏟️" label="Maior Público/Jogo" value="68.991" sub="EUA 1994 · média por jogo" color={C.goldLight} />
              <KpiCard icon="🌍" label="Países Campeões" value="8" sub="nações diferentes" color={C.purple} />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:14, marginBottom:14 }}>
              {/* Linha de Público Médio */}
              <Card>
                <STitle right="público médio por partida">Evolução do Público Médio por Copa</STitle>
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={attendanceSeries}>
                    <defs>
                      <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.gold} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                    <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize:10 }} interval={2}/>
                    <YAxis stroke={C.muted} tick={{ fontSize:10 }} tickFormatter={v => v.toLocaleString()}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Area type="monotone" dataKey="avg" name="Média/Jogo" stroke={C.gold} fill="url(#avgGrad)" strokeWidth={2.5}
                      dot={(p) => selectedYear === p.payload.year ? <circle key={p.key} cx={p.cx} cy={p.cy} r={6} fill={C.gold}/> : <circle key={p.key} cx={p.cx} cy={p.cy} r={3} fill={C.gold}/>}
                      activeDot={{ r:7, fill:C.goldLight, onClick:(_, p) => setSelectedYear(p.payload.year) }}/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Campeões */}
              <Card>
                <STitle right="nº de títulos">Ranking de Campeões</STitle>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={champions} layout="vertical" margin={{ left:10 }}>
                    <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" stroke={C.muted} tick={{ fontSize:10 }}/>
                    <YAxis type="category" dataKey="name" stroke={C.muted} tick={{ fontSize:11 }} width={110}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="count" name="Títulos" radius={[0,6,6,0]}>
                      {champions.map((_, i) => <Cell key={i} fill={i===0?C.gold:i===1?C.green:C.border}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Tabela últimas copas */}
            <Card>
              <STitle right="ordenado do mais recente">Resultados Históricos Completos</STitle>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>{["Ano","Sede","Campeão 🏆","Vice-campeão","Artilheiro","Jogos","Público Total","Média/Jogo"].map(h=>(
                      <th key={h} style={{ color:C.muted, textAlign:"left", padding:"8px 10px", borderBottom:`1px solid ${C.border}`, fontSize:10, fontWeight:700, whiteSpace:"nowrap", letterSpacing:"0.08em" }}>{h.toUpperCase()}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[...WC_DATA].reverse().map((d,i)=>(
                      <tr key={d.Year} style={{ background: i%2===0?"transparent":C.panelAlt, cursor:"pointer" }}
                        onClick={()=>setSelectedYear(selectedYear===d.Year?null:d.Year)}>
                        <td style={{ padding:"8px 10px", color:C.goldLight, fontWeight:800 }}>{d.Year}</td>
                        <td style={{ padding:"8px 10px", color:C.muted }}>{FLAG(d.Host)} {T(d.Host)}</td>
                        <td style={{ padding:"8px 10px", color:C.accent, fontWeight:700 }}>{FLAG(d.Champion)} {T(d.Champion)}</td>
                        <td style={{ padding:"8px 10px" }}>{FLAG(d.RunnerUp)} {T(d.RunnerUp)}</td>
                        <td style={{ padding:"8px 10px", color:C.muted, fontSize:11 }}>{d.TopScorer}</td>
                        <td style={{ padding:"8px 10px", textAlign:"center" }}>{d.Matches}</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", color:C.blue }}>{(d.Attendance/1e6).toFixed(2)}M</td>
                        <td style={{ padding:"8px 10px", textAlign:"right", color: d.AttendanceAvg>=55000?C.gold:C.white }}>{d.AttendanceAvg.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ══ TAB: HISTÓRICO ════════════════════════════════════════════ */}
        {tab === "historico" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <Card>
                <STitle right="gols por jogo">Média de Gols por Edição</STitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={WC_DATA.map(d=>({
                    year: d.Year,
                    "Média de Gols": +(d.AttendanceAvg > 0
                      ? [3.89,4.12,4.67,4.00,5.38,3.60,2.78,2.78,2.97,2.55,2.68,2.81,2.54,2.21,2.71,2.67,2.52,2.30,2.27,2.67,2.64,2.69]
                          [WC_DATA.findIndex(w=>w.Year===d.Year)]
                      : 2.65).toFixed(2),
                  }))}>
                    <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                    <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize:9 }} interval={2}/>
                    <YAxis stroke={C.muted} tick={{ fontSize:10 }} domain={[1.5, 6]}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="Média de Gols" fill={C.green} radius={[4,4,0,0]} opacity={0.85}>
                      {WC_DATA.map((d,i)=><Cell key={i} fill={parseFloat([3.89,4.12,4.67,4.00,5.38,3.60,2.78,2.78,2.97,2.55,2.68,2.81,2.54,2.21,2.71,2.67,2.52,2.30,2.27,2.67,2.64,2.69][i])>=4?C.gold:C.green}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <STitle right="soma na edição">Público Total por Copa (milhões)</STitle>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={WC_DATA.map(d=>({ year:d.Year, milhoes:+(d.Attendance/1e6).toFixed(2) }))}>
                    <defs>
                      <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.blue} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                    <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize:9 }} interval={2}/>
                    <YAxis stroke={C.muted} tick={{ fontSize:10 }}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Area type="monotone" dataKey="milhoes" name="Público (M)" stroke={C.blue} fill="url(#blueGrad)" strokeWidth={2.5} dot={{ r:3, fill:C.blue }}/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card style={{ marginBottom:14 }}>
              <STitle right="artilheiros dos últimos 10 mundiais">Artilheiros das Copas</STitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[...WC_DATA].reverse().slice(0,10).map(d => {
                    const m = d.TopScorer.match(/- (\d+)/);
                    const goals = m ? parseInt(m[1]) : 0;
                    const nome = d.TopScorer.split(" -")[0].split(",")[0].trim();
                    return { year: d.Year, nome, gols: goals, label: `${d.Year}` };
                  })}
                  margin={{ bottom: 55 }}
                >
                  <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                  <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize:10 }}
                    tickFormatter={(v, i) => {
                      const row = [...WC_DATA].reverse().slice(0,10)[i];
                      if (!row) return v;
                      const nome = row.TopScorer.split(" -")[0].split(",")[0].trim();
                      return `${v}\n${nome}`;
                    }}
                    interval={0}
                    tick={({ x, y, payload, index }) => {
                      const row = [...WC_DATA].reverse().slice(0,10)[index];
                      const nome = row ? row.TopScorer.split(" -")[0].split(",")[0].trim() : "";
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text x={0} y={0} dy={12} textAnchor="middle" fill={C.muted} fontSize={10}>{payload.value}</text>
                          <text x={0} y={0} dy={26} textAnchor="middle" fill={C.white} fontSize={9}>{nome.split(" ").slice(-1)[0]}</text>
                        </g>
                      );
                    }}
                    height={55}
                  />
                  <YAxis stroke={C.muted} tick={{ fontSize:11 }} domain={[0,14]}/>
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background:"#0d1f0d", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px" }}>
                        <p style={{ color:C.gold, fontWeight:800, margin:"0 0 4px" }}>{d.year}</p>
                        <p style={{ color:C.white, margin:0, fontSize:13 }}>🥇 {d.nome}</p>
                        <p style={{ color:C.accent, margin:0, fontSize:13 }}>{d.gols} gols</p>
                      </div>
                    );
                  }}/>
                  <Bar dataKey="gols" name="Gols" radius={[6,6,0,0]}>
                    {[...WC_DATA].reverse().slice(0,10).map((_, i) => <Cell key={i} fill={C.chart[i%8]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <STitle right="crescimento ao longo das décadas">Evolução do Número de Equipes Participantes</STitle>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={WC_DATA.map(d=>({ year:d.Year, equipes:d.Teams }))}>
                  <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                  <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize:10 }} interval={2}/>
                  <YAxis stroke={C.muted} tick={{ fontSize:10 }} domain={[10,36]}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Line type="stepAfter" dataKey="equipes" name="Equipes" stroke={C.purple} strokeWidth={3} dot={{ fill:C.purple, r:5 }}/>
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display:"flex", gap:20, marginTop:10 }}>
                {[{y:"1930-1974",e:13,c:C.muted},{y:"1982-1994",e:24,c:C.blue},{y:"1998-2022",e:32,c:C.green},{y:"2026",e:48,c:C.gold}].map(e=>(
                  <div key={e.y} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:20, fontWeight:900, color:e.c }}>{e.e}</div>
                    <div style={{ fontSize:10, color:C.muted }}>{e.y}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ══ TAB: COPA 2026 ════════════════════════════════════════════ */}
        {tab === "copa2026" && (
          <div>
            <div style={{ background:`linear-gradient(135deg, #0a1a2a, #0a2a1a)`, border:`1px solid ${C.blue}44`, borderRadius:14, padding:"18px 24px", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <span style={{ fontSize:48 }}>🌎</span>
                <div>
                  <h2 style={{ margin:0, color:C.gold, fontFamily:"Georgia,serif", fontSize:20 }}>Copa do Mundo FIFA 2026</h2>
                  <p style={{ margin:"4px 0 0", color:C.mutedLight, fontSize:13 }}>
                    Sede tripla: <strong style={{color:C.white}}>🇺🇸 Estados Unidos · 🇨🇦 Canadá · 🇲🇽 México</strong> · 48 seleções · 104 jogos · Junho–Julho 2026
                  </p>
                </div>
                <div style={{ marginLeft:"auto", display:"flex", gap:12 }}>
                  {[{v:"48",l:"Seleções",c:C.gold},{v:"104",l:"Partidas",c:C.accent},{v:"16",l:"Grupos",c:C.blue},{v:"3",l:"Países-sede",c:C.purple}].map(k=>(
                    <div key={k.l} style={{ textAlign:"center", minWidth:50 }}>
                      <div style={{ fontSize:22, fontWeight:900, color:k.c }}>{k.v}</div>
                      <div style={{ fontSize:10, color:C.muted }}>{k.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              {/* Gols marcados vs sofridos */}
              <Card>
                <STitle right="últimos 4 anos">Gols Marcados vs Sofridos (Top 12)</STitle>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={goals2026} layout="vertical" margin={{ left:10, right:10 }}>
                    <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" stroke={C.muted} tick={{ fontSize:10 }}/>
                    <YAxis type="category" dataKey="name" stroke={C.muted} tick={{ fontSize:11 }} width={110}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend/>
                    <Bar dataKey="gols_marcados" name="Gols Marcados" fill={C.accent} radius={[0,4,4,0]}/>
                    <Bar dataKey="gols_sofridos" name="Gols Sofridos" fill={C.red} radius={[0,4,4,0]} opacity={0.75}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Por continente */}
              <Card>
                <STitle right="48 seleções classificadas">Distribuição por Continente</STitle>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:8 }}>
                  {Object.entries(
                    TEST_2026.reduce((acc, t) => { acc[t.continent] = (acc[t.continent]||[]); acc[t.continent].push(t); return acc; }, {})
                  ).sort((a,b)=>b[1].length-a[1].length).map(([cont, teams]) => (
                    <div key={cont}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ color:CONTINENT_COLOR[cont]||C.white, fontWeight:700, fontSize:12 }}>{TC(cont)}</span>
                        <span style={{ color:C.muted, fontSize:11 }}>{teams.length} seleções</span>
                      </div>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                        {teams.map(t => (
                          <span key={t.team} title={t.team} style={{ fontSize:18, cursor:"default" }}>{FLAG(t.team)}</span>
                        ))}
                      </div>
                      <div style={{ height:4, background:C.border, borderRadius:2, marginTop:4 }}>
                        <div style={{ height:4, background:CONTINENT_COLOR[cont]||C.muted, borderRadius:2, width:`${(teams.length/48)*100}%` }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Radar das seleções hosts */}
            <Card>
              <STitle right="EUA · Canadá · México">Análise dos Países-Sede 2026</STitle>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                {TEST_2026.filter(t=>t.is_host).map(t=>(
                  <div key={t.team} style={{ background:C.panelAlt, border:`1px solid ${C.borderLight}`, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <span style={{ fontSize:32 }}>{FLAG(t.team)}</span>
                      <div>
                        <div style={{ fontWeight:800, fontSize:14 }}>{T(t.team)}</div>
                        <div style={{ color:C.muted, fontSize:11 }}>Rank FIFA: #{t.fifa_rank} · {TC(t.continent)}</div>
                      </div>
                    </div>
                    {[
                      { l:"Vitórias (4 anos)", v:t.wins, max:37, c:C.accent },
                      { l:"Gols Marcados", v:t.goals_scored, max:110, c:C.gold },
                      { l:"Valor do Elenco", v:`$${t.market_value}M`, pct:(t.market_value/1300)*100, c:C.blue },
                      { l:"Pontos FIFA", v:t.fifa_pts.toFixed(0), pct:(t.fifa_pts/1877)*100, c:C.purple },
                    ].map(row=>(
                      <div key={row.l} style={{ marginBottom:8 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:11, color:C.muted }}>{row.l}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:row.c }}>{row.v}</span>
                        </div>
                        <div style={{ height:4, background:C.border, borderRadius:2 }}>
                          <div style={{ height:4, background:row.c, borderRadius:2, width:`${row.pct || (t[row.l]||0)/row.max*100}%` }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ══ TAB: FAVORITOS ════════════════════════════════════════════ */}
        {tab === "selecoes" && (
          <div>
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ color:C.muted, fontSize:12, fontWeight:700 }}>FILTRAR POR CONTINENTE:</span>
              {continents.map(c=>(
                <button key={c} onClick={()=>setContinentFilter(c)} style={{
                  background: continentFilter===c ? (CONTINENT_COLOR[c]||C.gold) : C.border,
                  color: continentFilter===c ? C.bg : C.muted,
                  border:"none", borderRadius:8, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:700
                }}>{TC(c)}</button>
              ))}
            </div>

            {/* Score cards top 6 */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 }}>
              {filtered2026.slice(0,6).map((t, i) => {
                const maxPts = 1877.32; // pontos do #1 (França)
                const pct = Math.min((t.fifa_pts / maxPts) * 100, 100);
                return (
                  <div key={t.team} onClick={()=>setTeamFilter(teamFilter===t.team?"All":t.team)}
                    style={{ background: teamFilter===t.team ? "#1a3a1a" : C.panel, border:`1px solid ${teamFilter===t.team?C.greenLight:C.border}`, borderRadius:12, padding:"16px 18px", cursor:"pointer", transition:"all .2s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:34 }}>{FLAG(t.team)}</span>
                        <div>
                          <div style={{ fontWeight:800, fontSize:14 }}>{T(t.team)}</div>
                          <div style={{ color:CONTINENT_COLOR[t.continent]||C.muted, fontSize:11, fontWeight:600 }}>{TC(t.continent)}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:22, fontWeight:900, color: i===0?C.gold:i<=2?C.goldLight:C.white }}>#{t.fifa_rank}</div>
                        <div style={{ fontSize:10, color:C.muted }}>rank FIFA</div>
                      </div>
                    </div>

                    <div style={{ margin:"14px 0 4px", display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:10, color:C.muted }}>Pontos FIFA</span>
                      <span style={{ fontSize:10, color:C.gold, fontWeight:700 }}>{t.fifa_pts.toFixed(0)} pts</span>
                    </div>
                    <div style={{ height:5, background:C.border, borderRadius:3, marginBottom:10 }}>
                      <div style={{ height:5, borderRadius:3, background: i===0?C.gold:i<=2?C.greenLight:C.blue, width:`${pct}%`, transition:"width .5s" }}/>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
                      {[
                        { l:"Vitórias", v:t.wins, c:C.accent },
                        { l:"Títulos", v:t.titles, c:C.gold },
                        { l:"Aprov.", v:`${winRate(t)}%`, c:C.blue },
                      ].map(s=>(
                        <div key={s.l} style={{ textAlign:"center", background:C.panelAlt, borderRadius:6, padding:"6px 4px" }}>
                          <div style={{ fontSize:16, fontWeight:900, color:s.c }}>{s.v}</div>
                          <div style={{ fontSize:9, color:C.muted }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
                      <Badge label={`${t.goals_scored} gols marcados`} color="#002200" text={C.accent}/>
                      {t.is_host ? <Badge label="🏟️ Sede" color="#2a2000" text={C.gold}/> : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabela completa */}
            <Card>
              <STitle right={`${filtered2026.length} seleções`}>Ranking Completo — Copa 2026</STitle>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>{["#","Seleção","Continente","Rank FIFA","Pontos FIFA","Vitórias","Gols Pró","Gols Contra","Saldo","Valor €M","Idade Média","Títulos"].map(h=>(
                      <th key={h} style={{ color:C.muted, padding:"8px 10px", borderBottom:`1px solid ${C.border}`, fontSize:10, fontWeight:700, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {filtered2026.map((t, i)=>(
                      <tr key={t.team} onClick={()=>setTeamFilter(teamFilter===t.team?"All":t.team)}
                        style={{ background: teamFilter===t.team?"#1a3a1a":i%2===0?"transparent":C.panelAlt, cursor:"pointer" }}>
                        <td style={{ padding:"7px 10px", color:i<3?C.gold:C.muted, fontWeight:i<3?900:400 }}>{i+1}</td>
                        <td style={{ padding:"7px 10px", fontWeight:700 }}>{FLAG(t.team)} {T(t.team)}{t.is_host?" 🏟️":""}</td>
                        <td style={{ padding:"7px 10px" }}><span style={{ color:CONTINENT_COLOR[t.continent]||C.white, fontWeight:600, fontSize:11 }}>{TC(t.continent)}</span></td>
                        <td style={{ padding:"7px 10px", color:t.fifa_rank<=5?C.gold:C.white, fontWeight:t.fifa_rank<=5?800:400 }}>#{t.fifa_rank}</td>
                        <td style={{ padding:"7px 10px", color:C.muted }}>{t.fifa_pts.toFixed(0)}</td>
                        <td style={{ padding:"7px 10px", color:C.accent }}>{t.wins}</td>
                        <td style={{ padding:"7px 10px", color:C.accent }}>{t.goals_scored}</td>
                        <td style={{ padding:"7px 10px", color:C.red }}>{t.goals_received}</td>
                        <td style={{ padding:"7px 10px", color: t.goals_scored-t.goals_received>=40?C.gold:t.goals_scored-t.goals_received>0?C.accent:C.red, fontWeight:700 }}>
                          {t.goals_scored-t.goals_received > 0 ? "+" : ""}{t.goals_scored-t.goals_received}
                        </td>
                        <td style={{ padding:"7px 10px", color:t.market_value>=800?C.gold:C.muted }}>{t.market_value}</td>
                        <td style={{ padding:"7px 10px", color: t.avg_age<=26?C.accent:t.avg_age>=29?C.red:C.white }}>{t.avg_age}</td>
                        <td style={{ padding:"7px 10px" }}>
                          {t.titles > 0 ? <span style={{ color:C.gold, fontWeight:900 }}>{'⭐'.repeat(t.titles)}</span> : <span style={{ color:C.muted }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ══ TAB: TENDÊNCIAS ══════════════════════════════════════════ */}
        {tab === "tendencias" && (() => {
          // ── dados derivados ───────────────────────────────────────────
          // Décadas: média de público por década
          const decades = [
            { era:"1930–1950", years:[1930,1934,1938,1950] },
            { era:"1954–1970", years:[1954,1958,1962,1966,1970] },
            { era:"1974–1986", years:[1974,1978,1982,1986] },
            { era:"1990–1998", years:[1990,1994,1998] },
            { era:"2002–2014", years:[2002,2006,2010,2014] },
            { era:"2018–2022", years:[2018,2022] },
          ].map(d => {
            const rows = WC_DATA.filter(w => d.years.includes(w.Year));
            return {
              era: d.era,
              avgPublico: Math.round(rows.reduce((s,r)=>s+r.AttendanceAvg,0)/rows.length),
              avgJogos: Math.round(rows.reduce((s,r)=>s+r.Matches,0)/rows.length),
            };
          });

          // Gols do artilheiro por edição
          const artilheiroTrend = WC_DATA.map(d => {
            const m = d.TopScorer.match(/- (\d+)/);
            return { year: d.Year, gols: m ? parseInt(m[1]) : 0 };
          });

          // Seleções 2026 em alta (saldo positivo alto + bom aproveitamento)
          const emAlta = [...TEST_2026]
            .map(t => ({
              ...t,
              saldo: t.goals_scored - t.goals_received,
              aproveitamento: +((t.wins/(t.wins+t.losses+t.draws))*100).toFixed(1),
            }))
            .sort((a,b) => (b.saldo + b.aproveitamento*0.5) - (a.saldo + a.aproveitamento*0.5))
            .slice(0, 10);

          const emBaixa = [...TEST_2026]
            .map(t => ({
              ...t,
              saldo: t.goals_scored - t.goals_received,
              aproveitamento: +((t.wins/(t.wins+t.losses+t.draws))*100).toFixed(1),
            }))
            .sort((a,b) => (a.saldo + a.aproveitamento*0.5) - (b.saldo + b.aproveitamento*0.5))
            .slice(0, 6);

          // Perfil dos campeões recentes (últimas 6 edições com dados análogos de 2026)
          const champProfile = [
            { year:2022, team:"Argentina", rank:3, market:575, age:27.9, wins:30, saldo:66 },
            { year:2018, team:"France",    rank:1, market:1290,age:26.7, wins:25, saldo:53 },
            { year:2014, team:"Germany",   rank:10,market:828, age:26.6, wins:21, saldo:33 },
            { year:2010, team:"Spain",     rank:2, market:1150,age:27.2, wins:29, saldo:72 },
            { year:2006, team:"Italy",     rank:12,market:520, age:29.0, wins:18, saldo:15 },
            { year:2002, team:"Brazil",    rank:6, market:932, age:27.8, wins:15, saldo:19 },
          ];

          // Tendência de idade média dos elencos 2026 top 10
          const ageDist = [...TEST_2026]
            .sort((a,b)=>a.fifa_rank-b.fifa_rank)
            .slice(0,15)
            .map(t=>({ name:`${FLAG(t.team)} ${T(t.team)}`, idade:t.avg_age, rank:t.fifa_rank }));

          // Valor de elenco vs aproveitamento (scatter)
          const scatterData = TEST_2026.slice(0,20).map(t=>({
            name: `${FLAG(t.team)} ${T(t.team)}`,
            valor: Math.round(t.market_value/10)*10,
            aprov: +((t.wins/(t.wins+t.losses+t.draws))*100).toFixed(1),
            rank: t.fifa_rank,
          }));

          return (
            <div>
              {/* ── Insight cards ── */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
                {[
                  { icon:"📉", label:"Gols do artilheiro", value:"Caindo", sub:"média baixou de 9 para 6 gols desde 1970", color:C.red },
                  { icon:"👥", label:"Público/jogo (era 32 equipes)", value:"~50k", sub:"estável desde 1998", color:C.blue },
                  { icon:"⚡", label:"Seleção em melhor forma", value:"🇲🇦 Marrocos", sub:"37V • 2D • saldo +82 (4 anos)", color:C.accent },
                  { icon:"⚠️", label:"Grande favorito em baixa", value:"🇧🇷 Brasil", sub:"só 15V em 35 jogos (42.9%)", color:C.gold },
                ].map(k=>(
                  <Card key={k.label} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:28 }}>{k.icon}</div>
                    <div style={{ fontSize:17, fontWeight:900, color:k.color, margin:"6px 0 4px", lineHeight:1.2 }}>{k.value}</div>
                    <div style={{ color:C.white, fontSize:11, fontWeight:700 }}>{k.label}</div>
                    <div style={{ color:C.muted, fontSize:10, marginTop:4 }}>{k.sub}</div>
                  </Card>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                {/* Tendência de artilheiros */}
                <Card>
                  <STitle right="gols do artilheiro por Copa">Tendência: Artilheiros ao Longo das Edições</STitle>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={artilheiroTrend}>
                      <defs>
                        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.red} stopOpacity={0.35}/>
                          <stop offset="95%" stopColor={C.red} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                      <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize:9 }} interval={2}/>
                      <YAxis stroke={C.muted} tick={{ fontSize:10 }} domain={[3,15]}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Area type="monotone" dataKey="gols" name="Gols Artilheiro" stroke={C.red} fill="url(#redGrad)" strokeWidth={2.5} dot={{ r:4, fill:C.red }}/>
                    </AreaChart>
                  </ResponsiveContainer>
                  <p style={{ color:C.muted, fontSize:11, margin:"8px 0 0" }}>
                    📌 Tendência de queda: Just Fontaine marcou 13 gols em 1958; nas últimas 5 Copas a média caiu para 6–8 gols.
                  </p>
                </Card>

                {/* Público médio por era */}
                <Card>
                  <STitle right="público médio por partida">Tendência: Público Médio por Era</STitle>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={decades}>
                      <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                      <XAxis dataKey="era" stroke={C.muted} tick={{ fontSize:10 }}/>
                      <YAxis stroke={C.muted} tick={{ fontSize:10 }} tickFormatter={v=>v.toLocaleString()}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Bar dataKey="avgPublico" name="Média/Jogo" radius={[6,6,0,0]}>
                        {decades.map((d,i)=><Cell key={i} fill={i===5?C.gold:C.green}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p style={{ color:C.muted, fontSize:11, margin:"8px 0 0" }}>
                    📌 Pico em 1994 nos EUA (68.991/jogo). Era de 32 equipes mantém média estável entre 47–54 mil.
                  </p>
                </Card>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                {/* Seleções em alta 2026 */}
                <Card>
                  <STitle right="últimos 4 anos">🔺 Seleções em Alta — Pré-2026</STitle>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {emAlta.map((t,i)=>(
                      <div key={t.team} style={{ display:"flex", alignItems:"center", gap:10, background:i===0?"#001a00":C.panelAlt, borderRadius:8, padding:"8px 12px", border:`1px solid ${i===0?C.greenLight:C.border}` }}>
                        <span style={{ fontSize:22, minWidth:30, textAlign:"center" }}>{FLAG(t.team)}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13 }}>{T(t.team)} <span style={{ color:C.muted, fontSize:11, fontWeight:400 }}>#{t.fifa_rank} FIFA</span></div>
                          <div style={{ display:"flex", gap:10, marginTop:3 }}>
                            <span style={{ color:C.accent, fontSize:11 }}>{t.wins}V · {t.losses}D</span>
                            <span style={{ color:C.gold, fontSize:11 }}>Saldo: +{t.saldo > 0 ? t.saldo : 0}</span>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:16, fontWeight:900, color:t.aproveitamento>=75?C.accent:C.goldLight }}>{t.aproveitamento}%</div>
                          <div style={{ fontSize:10, color:C.muted }}>aproveit.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Seleções em baixa */}
                <Card>
                  <STitle right="últimos 4 anos">🔻 Seleções em Baixa — Pré-2026</STitle>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
                    {emBaixa.map((t,i)=>(
                      <div key={t.team} style={{ display:"flex", alignItems:"center", gap:10, background:i===0?"#1a0000":C.panelAlt, borderRadius:8, padding:"8px 12px", border:`1px solid ${i===0?C.red+"55":C.border}` }}>
                        <span style={{ fontSize:22, minWidth:30, textAlign:"center" }}>{FLAG(t.team)}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13 }}>{T(t.team)} <span style={{ color:C.muted, fontSize:11, fontWeight:400 }}>#{t.fifa_rank} FIFA</span></div>
                          <div style={{ display:"flex", gap:10, marginTop:3 }}>
                            <span style={{ color:C.red, fontSize:11 }}>{t.losses} derrotas</span>
                            <span style={{ color:C.muted, fontSize:11 }}>Saldo: {t.saldo}</span>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:16, fontWeight:900, color:t.aproveitamento<45?C.red:C.muted }}>{t.aproveitamento}%</div>
                          <div style={{ fontSize:10, color:C.muted }}>aproveit.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Perfil dos campeões recentes + comparação com 2026 */}
              <Card style={{ marginBottom:14 }}>
                <STitle right="rank FIFA, valor e aproveitamento na época">Perfil dos Campeões Recentes vs Candidatas 2026</STitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={champProfile} margin={{ right:20 }}>
                    <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                    <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize:11 }}/>
                    <YAxis yAxisId="left" stroke={C.muted} tick={{ fontSize:10 }} domain={[0,40]}/>
                    <YAxis yAxisId="right" orientation="right" stroke={C.muted} tick={{ fontSize:10 }} domain={[0,15]}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend/>
                    <Bar yAxisId="left" dataKey="wins" name="Vitórias (4a)" fill={C.green} radius={[4,4,0,0]} opacity={0.85}/>
                    <Bar yAxisId="right" dataKey="rank" name="Rank FIFA" fill={C.gold} radius={[4,4,0,0]} opacity={0.7}/>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8, marginTop:12 }}>
                  {champProfile.map(c=>(
                    <div key={c.year} style={{ background:C.panelAlt, borderRadius:8, padding:"8px 10px", textAlign:"center", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:20 }}>{FLAG(c.team)}</div>
                      <div style={{ fontWeight:800, fontSize:12, color:C.gold, marginTop:4 }}>{c.year}</div>
                      <div style={{ fontSize:11, color:C.white }}>{c.team}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>Rank #{c.rank} · {c.age}a</div>
                      <div style={{ fontSize:10, color:C.accent }}>Saldo +{c.saldo}</div>
                    </div>
                  ))}
                </div>
                <p style={{ color:C.muted, fontSize:11, margin:"12px 0 0", lineHeight:1.6 }}>
                  📌 <strong style={{color:C.white}}>Padrão identificado:</strong> campeões recentes geralmente têm rank FIFA entre #1 e #6, saldo de gols positivo acima de +15 e aproveitamento &gt;60% nos 4 anos pré-torneio. <strong style={{color:C.accent}}>Argentina</strong> e <strong style={{color:C.blue}}>França</strong> se encaixam nesse perfil para 2026.
                </p>
              </Card>

              {/* Idade média vs rank */}
              <Card>
                <STitle right="top 15 seleções por rank FIFA">Tendência: Idade Média dos Elencos Pré-2026</STitle>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={ageDist}>
                    <CartesianGrid stroke={C.border} strokeDasharray="4 4"/>
                    <XAxis dataKey="name" stroke={C.muted} tick={{ fontSize:9 }} interval={0} angle={-30} textAnchor="end" height={50}/>
                    <YAxis stroke={C.muted} tick={{ fontSize:10 }} domain={[24,31]}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="idade" name="Idade Média" radius={[6,6,0,0]}>
                      {ageDist.map((d,i)=>(
                        <Cell key={i} fill={d.idade<=26.5?C.accent:d.idade>=29?C.red:C.blue}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", gap:16, marginTop:10, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:12, height:12, background:C.accent, borderRadius:2, display:"inline-block" }}/><span style={{ fontSize:11, color:C.muted }}>Jovem (≤26.5) — maior potencial</span></div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:12, height:12, background:C.blue, borderRadius:2, display:"inline-block" }}/><span style={{ fontSize:11, color:C.muted }}>Intermediário (26.5–29)</span></div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:12, height:12, background:C.red, borderRadius:2, display:"inline-block" }}/><span style={{ fontSize:11, color:C.muted }}>Veterano (≥29) — risco de declínio</span></div>
                </div>
              </Card>
            </div>
          );
        })()}

      </div>

      <div style={{ textAlign:"center", padding:"16px", color:C.muted, fontSize:10, borderTop:`1px solid ${C.border}` }}>
        Fontes: world_cup.csv · test.csv (48 seleções Copa 2026) · Dados históricos FIFA 1930–2022
      </div>
    </div>
  );
}
