export type KanjiTypographyStyle = 'bold-gothic' | 'mincho' | 'brush' | 'square-gothic' | 'stencil' | 'seal' | 'handwritten' | 'condensed' | 'distressed' | 'engraved';
export type KanjiUsage = 'product-name' | 'huge-type' | 'stamp';
export type KanjiMode = 'direct' | 'poetic' | 'contrast';
export type KanjiTerm = { id: string; text: string; reading: string; nuance: string; tags: string[] };

const rows: Array<[string, string, string, string, string]> = [
  ['K001','轟','ごう','爆音・圧・巨大な鳴り','FUZZ DRIVE HEAVY NOISE'], ['K002','刀','かたな','切れ味・鋭さ','DRIVE BOOST FILTER INDUSTRIAL'],
  ['K003','響','ひびき','響き・共鳴','DELAY REVERB AMBIENT'], ['K004','残','ざん','残響・残像・余り','DELAY REVERB AMBIENT'],
  ['K005','波','なみ','揺れ・波形','MOD DELAY FILTER SYNTH'], ['K006','歪','ゆがみ','歪み・変形','DRIVE FUZZ NOISE'],
  ['K007','雷','かみなり','瞬発力・電気・攻撃性','FUZZ DRIVE SYNTH'], ['K008','炎','ほのお','熱・飽和・勢い','DRIVE FUZZ HEAVY'],
  ['K009','黒','くろ','暗さ・重さ','DARK FUZZ PREAMP'], ['K010','白','しろ','透明・無垢・明るさ','CLEAN BRIGHT AMBIENT'],
  ['K011','零','れい','ゼロ・冷たさ・無機質','DIGITAL SYNTH MINIMAL'], ['K012','震','しん','振動・揺れ・震源','MOD FUZZ BASS'],
  ['K013','音','おと','音そのもの','ALL MINIMAL'], ['K014','夜','よる','夜・静寂・暗さ','AMBIENT DARK REVERB'],
  ['K015','月','つき','夜・幻想','AMBIENT REVERB CUTE'], ['K016','星','ほし','光・遠さ','AMBIENT SYNTH BRIGHT'],
  ['K017','影','かげ','陰影・残像','DELAY REVERB DARK'], ['K018','夢','ゆめ','幻想・浮遊','AMBIENT MOD REVERB'],
  ['K019','鋼','はがね','金属・硬質','INDUSTRIAL DRIVE PREAMP'], ['K020','鉄','てつ','無骨・重量感','INDUSTRIAL FUZZ BASS'],
  ['K021','凛','りん','冷静・透明・鋭い','CLEAN BRIGHT COMP'], ['K022','深','しん','深さ・奥行き','BASS REVERB AMBIENT'],
  ['K023','遠','とお','距離・遅延','DELAY REVERB'], ['K024','時','とき','時間・反復','DELAY DIGITAL'],
  ['K025','空','そら','空間・余白','REVERB AMBIENT CLEAN'], ['K026','虚','きょ','空虚・無機質','DARK SYNTH NOISE'],
  ['K027','狂','きょう','暴走・不安定','FUZZ NOISE EXPERIMENTAL'], ['K028','塊','かたまり','音の壁・密度','FUZZ HEAVY BASS'],
  ['K029','崩','ほう','崩壊・破砕','FUZZ NOISE EXPERIMENTAL'], ['K030','裂','れつ','裂ける・割れる','FUZZ DRIVE FILTER'],
  ['K031','霞','かすみ','薄霧・ぼやけ','REVERB AMBIENT MOD'], ['K032','霧','きり','曖昧・拡散','REVERB AMBIENT'],
  ['K033','雨','あめ','粒・反復・静けさ','DELAY REVERB CUTE'], ['K034','雪','ゆき','冷たさ・透明','CLEAN AMBIENT BRIGHT'],
  ['K035','光','ひかり','明るさ・煌めき','BRIGHT REVERB SYNTH'], ['K036','灯','あかり','小さな光・温度感','VINTAGE AMBIENT CUTE'],
  ['K037','韻','いん','余韻・響き','DELAY REVERB'], ['K038','間','ま','空白・間隔・呼吸','MINIMAL DELAY AMBIENT'],
  ['K039','線','せん','信号・波形・工業的','DIGITAL FILTER INDUSTRIAL'], ['K040','点','てん','最小単位・LED・粒','MINIMAL DIGITAL CUTE'],
  ['K041','環','かん','循環・ループ','DELAY MOD SYNTH'], ['K042','渦','うず','回転・揺れ・螺旋','MOD FILTER SYNTH'],
  ['K043','脈','みゃく','パルス・周期','MOD SYNTH COMP'], ['K044','圧','あつ','圧縮・押し出し','COMP BOOST BASS'],
  ['K045','低','てい','低音・低域','BASS PREAMP FILTER'], ['K046','速','そく','速度・アタック','MOD DELAY COMP'],
  ['K047','鈍','どん','太さ・丸さ・鈍い歪み','FUZZ BASS VINTAGE'], ['K048','尖','せん','尖り・高域・攻撃性','DRIVE FILTER BRIGHT'],
  ['K049','彩','さい','色彩・多色感','MOD SYNTH CUTE'], ['K050','粒','つぶ','グレイン・粒状感','FUZZ DELAY DIGITAL NOISE'],
  ['K051','残響','ざんきょう','残る響き','DELAY REVERB AMBIENT'], ['K052','余韻','よいん','音の余り・尾','DELAY REVERB'],
  ['K053','爆音','ばくおん','大音量・暴力的','FUZZ DRIVE HEAVY'], ['K054','雷鳴','らいめい','雷の轟き','FUZZ DRIVE HEAVY'],
  ['K055','音壁','おんぺき','音の壁','FUZZ HEAVY BASS'], ['K056','震源','しんげん','振動の中心','BASS FUZZ MOD'],
  ['K057','深層','しんそう','深さ・低域・奥行き','BASS REVERB AMBIENT'], ['K058','低音','ていおん','ベース・低域','BASS PREAMP'],
  ['K059','白夜','びゃくや','明るい夜・幻想','AMBIENT REVERB BRIGHT'], ['K060','黒雨','こくう','暗い雨・不穏','DARK REVERB NOISE'],
  ['K061','幻影','げんえい','幻・残像','DELAY REVERB MOD'], ['K062','虚無','きょむ','無・空白','DARK SYNTH MINIMAL'],
  ['K063','空洞','くうどう','空間・空洞','REVERB FILTER AMBIENT'], ['K064','冷光','れいこう','冷たい光','DIGITAL BRIGHT SYNTH'],
  ['K065','暗転','あんてん','暗転・切替','DARK MOD EXPERIMENTAL'], ['K066','断線','だんせん','信号断・故障','NOISE EXPERIMENTAL DIGITAL'],
  ['K067','混線','こんせん','信号混濁','NOISE MOD SYNTH'], ['K068','雑音','ざつおん','ノイズ','NOISE FUZZ'],
  ['K069','轟音','ごうおん','重く巨大な音','FUZZ DRIVE HEAVY'], ['K070','飽和','ほうわ','サチュレーション','DRIVE PREAMP COMP'],
  ['K071','過圧','かあつ','圧・ブースト・過負荷','BOOST COMP DRIVE'], ['K072','破砕','はさい','砕けた音','FUZZ NOISE EXPERIMENTAL'],
  ['K073','崩壊','ほうかい','崩れる・壊れる','FUZZ NOISE'], ['K074','分裂','ぶんれつ','信号分岐・不安定','MOD SYNTH EXPERIMENTAL'],
  ['K075','反転','はんてん','位相・逆転','MOD DELAY FILTER'], ['K076','位相','いそう','フェイズ','MOD FILTER'],
  ['K077','共鳴','きょうめい','レゾナンス','FILTER REVERB SYNTH'], ['K078','発振','はっしん','オシレーション','DELAY FILTER SYNTH'],
  ['K079','脈動','みゃくどう','パルス','MOD SYNTH TREMOLO'], ['K080','循環','じゅんかん','ループ','DELAY MOD'],
  ['K081','反響','はんきょう','エコー','DELAY REVERB'], ['K082','遅延','ちえん','ディレイ','DELAY DIGITAL'],
  ['K083','残像','ざんぞう','視覚的な余韻','DELAY REVERB MOD'], ['K084','浮遊','ふゆう','浮遊感','AMBIENT REVERB MOD'],
  ['K085','夢幻','むげん','夢・幻','AMBIENT REVERB SYNTH'], ['K086','深夜','しんや','夜・静けさ','DARK AMBIENT'],
  ['K087','月影','つきかげ','月の影','AMBIENT DELAY DARK'], ['K088','夜光','やこう','夜に光る','SYNTH AMBIENT BRIGHT'],
  ['K089','電光','でんこう','電気・瞬発','DRIVE SYNTH BOOST'], ['K090','鉄屑','てつくず','金属・粗さ','FUZZ INDUSTRIAL NOISE'],
  ['K091','鋼音','こうおん','金属的な響き','INDUSTRIAL DRIVE PREAMP'], ['K092','機構','きこう','機械・構造','INDUSTRIAL DIGITAL FILTER'],
  ['K093','回路','かいろ','回路','INDUSTRIAL DIGITAL SYNTH'], ['K094','信号','しんごう','信号','DIGITAL FILTER PREAMP'],
  ['K095','電圧','でんあつ','電圧','DRIVE BOOST INDUSTRIAL'], ['K096','増幅','ぞうふく','増幅','BOOST PREAMP DRIVE'],
  ['K097','圧縮','あっしゅく','圧縮','COMP'], ['K098','変調','へんちょう','変調','MOD SYNTH'],
  ['K099','濾波','ろは','フィルタリング','FILTER SYNTH INDUSTRIAL'], ['K100','無音','むおん','静寂','MINIMAL EXPERIMENTAL FILTER'],
];

export const kanjiDictionary: KanjiTerm[] = rows.map(([id, text, reading, nuance, tags]) => ({ id, text, reading, nuance, tags: tags.split(' ') }));

const weightedPick = <T,>(random: () => number, entries: Array<[T, number]>) => {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0); let roll = random() * total;
  for (const [value, weight] of entries) { roll -= weight; if (roll <= 0) return value; }
  return entries[entries.length - 1][0];
};

export function selectKanjiTerm(random: () => number, effectTag: string) {
  const mode = weightedPick<KanjiMode>(random, [['direct', 40], ['poetic', 35], ['contrast', 25]]);
  const length = weightedPick<1 | 2>(random, [[1, 54], [2, 46]]);
  const pool = kanjiDictionary.filter(term => term.text.length === length);
  return weightedPick(random, pool.map(term => {
    const matches = term.tags.includes(effectTag) || term.tags.includes('ALL');
    const weight = mode === 'direct' ? (matches ? 2.6 : .75) : mode === 'poetic' ? (matches ? 1.45 : 1) : (matches ? .65 : 1.35);
    return [term, weight] as [KanjiTerm, number];
  }));
}

export function selectKanjiStyle(random: () => number) {
  return weightedPick<KanjiTypographyStyle>(random, [['bold-gothic', 20], ['mincho', 18], ['square-gothic', 14], ['brush', 10], ['stencil', 10], ['distressed', 8], ['engraved', 8], ['seal', 5], ['handwritten', 4], ['condensed', 3]]);
}

export function selectKanjiUsage(random: () => number) {
  return weightedPick<KanjiUsage>(random, [['product-name', 38], ['huge-type', 39], ['stamp', 23]]);
}
