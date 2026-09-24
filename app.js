const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const routes={home:'home-view',spots:'spots-view',quiz:'quiz-view',labs:'labs-view'};
function route(name){$$('.view').forEach(v=>v.classList.remove('active'));$('#'+routes[name]).classList.add('active');location.hash=name==='home'?'':name;window.scrollTo({top:0,behavior:'smooth'});}
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>route(b.dataset.route)));
route(location.hash.slice(1) in routes?location.hash.slice(1):'home');

// 本番運用時は、ここをSupabase / APIから取得する処理に置き換えます。
const ticketStatuses=JSON.parse(localStorage.getItem('machijikan-ticket-statuses')||'{}');
$('#check-ticket').onclick=()=>{const n=$('#ticket').value.replace(/\D/g,'');const out=$('#ticket-result');if(n.length!==6){out.textContent='受付票にある6桁の番号を入力してください。';return}localStorage.setItem('machijikan-last-ticket',n);const x=ticketStatuses[n];out.innerHTML=x?`<strong>${x.store||'受付状況'}</strong><br>${x.message}`:'現在の番号情報は確認できません。受付票をお持ちのうえ、薬局スタッフへお声がけください。';};
const saved=localStorage.getItem('machijikan-last-ticket');if(saved)$('#ticket').value=saved;

const spots={
 'ダリア調剤薬局':[{name:'周辺のお店・施設',text:'おすすめ情報は薬局ごとに順次追加しています。スタッフへ「近くのおすすめ」を聞いてみてください。'}],
 'レモン調剤薬局':[{name:'周辺のお店・施設',text:'おすすめ情報は薬局ごとに順次追加しています。スタッフへ「近くのおすすめ」を聞いてみてください。'}],
 'パンジー調剤薬局':[{name:'周辺のお店・施設',text:'おすすめ情報は薬局ごとに順次追加しています。スタッフへ「近くのおすすめ」を聞いてみてください。'}]
};
$('#store-select').onchange=e=>{$('#spot-list').innerHTML=(spots[e.target.value]||[]).map(x=>`<article class="spot"><h2>${x.name}</h2><p>${x.text}</p></article>`).join('')||'<div class="empty">店舗を選ぶと、周辺のおすすめが表示されます。</div>'};

const cats=['ぜんぶ','飲むタイミング','飲み方・剤形','飲み忘れ','保管・期限','お薬手帳・情報','副作用・体調変化','飲み合わせ','市販薬','抗菌薬','家族と安全'];let selectedCat='ぜんぶ';
$('#quiz-categories').innerHTML=cats.map(c=>`<button class="${c===selectedCat?'selected':''}" data-cat="${c}">${c}</button>`).join('');
$('#quiz-categories').onclick=e=>{if(!e.target.dataset.cat)return;selectedCat=e.target.dataset.cat;$$('#quiz-categories button').forEach(b=>b.classList.toggle('selected',b.dataset.cat===selectedCat));};
const facts=[
['飲むタイミング','「食後」の薬を飲む目安として一般的に近いのは？',['食事の直後〜30分以内','食事の2時間後だけ','就寝中だけ','空腹時だけ'],0,'食後は、一般に食事の後おおむね30分以内が目安です。薬袋の指示を優先してください。'],
['飲むタイミング','「食間」とは、いつのこと？',['食事中','食事と食事の間','食後すぐ','寝る直前'],1,'食間は食事中ではなく、食事と食事の間（目安として食後約2時間）です。'],
['飲むタイミング','「頓服薬」の説明として正しいのは？',['毎日決まった時刻に飲む','症状がある時など必要に応じて使う','半分に割って飲む薬','飲み忘れた薬'],1,'頓服薬は痛み・発熱など、指定された症状の時に使う薬です。回数・間隔を守りましょう。'],
['飲み方・剤形','錠剤を水なしで飲むと起こりやすいことは？',['薬がのどや食道に残り、傷めることがある','必ず効き目が強くなる','薬が無効になる','問題はない'],0,'薬は十分な水またはぬるま湯で飲むのが基本です。飲みにくい時は薬剤師へ相談してください。'],
['飲み方・剤形','自己判断で割らない方がよい錠剤は？',['割線のある普通錠','徐放錠・腸溶錠など','薬剤師から割ってよいと言われた錠剤','半錠指示の薬'],1,'徐放錠・腸溶錠などは、割ると効き方や安全性が変わることがあります。'],
['飲み方・剤形','粉薬を飲みやすくするため、薬剤師に相談できることは？',['服用補助ゼリーなどの利用','必ず熱湯に溶かす','飲まない','何でもジュースに混ぜる'],0,'剤形変更や服用補助ゼリーなど、飲みやすくする方法があります。'],
['飲み忘れ','飲み忘れに気づいた時、まず大切なのは？',['2回分を一度に飲む','薬袋・説明書を確認し、迷えば薬局へ連絡する','次の薬も全部やめる','必ず捨てる'],1,'薬ごとに対応が異なります。2回分をまとめて飲むのは危険なことがあります。'],
['飲み忘れ','飲み忘れを減らす工夫として適切なのは？',['服用時間を生活習慣と結びつける','薬を見えない場所に置く','薬袋を捨てる','家族にも言わない'],0,'歯みがきや食事など、毎日の習慣と結びつけると続けやすくなります。'],
['保管・期限','薬の保管場所として、一般に避けた方がよい場所は？',['直射日光や高温多湿の場所','涼しく乾いた場所','子どもの手の届かない場所','薬袋と一緒の場所'],0,'浴室・車内など高温多湿になりやすい場所は避けましょう。'],
['保管・期限','余った処方薬を家族にあげてよい？',['体格が同じならよい','症状が似ていればよい','原則としてあげない','薬袋を外せばよい'],2,'処方薬はその人の状態に合わせたものです。他人に渡さないでください。'],
['お薬手帳・情報','お薬手帳を1冊にまとめるメリットは？',['飲み合わせなどを確認しやすい','薬が不要になる','副作用が必ずなくなる','保険証の代わりになる'],0,'処方元が違っても、服用情報をまとめることで確認しやすくなります。'],
['お薬手帳・情報','市販薬やサプリも薬剤師へ伝えた方がよい？',['伝えなくてよい','飲み合わせ確認のため伝える','高価な物だけ伝える','半年に一度だけ伝える'],1,'市販薬・サプリにも相互作用や重複の可能性があります。'],
['副作用・体調変化','薬を飲み始めて、強い発疹や息苦しさが出た時は？',['次回まで待つ','緊急性を考え、速やかに医療機関へ相談する','薬を他人に渡す','必ず薬を半分にする'],1,'強い症状や急な息苦しさは緊急性があります。救急要請を含め速やかに相談してください。'],
['副作用・体調変化','眠気が出る薬を使う時の注意は？',['車の運転など危険作業を避ける','必ずコーヒーを飲む','昼だけ増量する','薬袋を捨てる'],0,'眠気の程度には個人差があります。運転・高所作業などは避けましょう。'],
['飲み合わせ','グレープフルーツジュースで影響を受ける薬がある？',['ない','ある。薬剤師へ確認する','子どもだけ','塗り薬だけ'],1,'一部の薬では血中濃度に影響します。薬袋の注意書きや薬剤師へ確認してください。'],
['飲み合わせ','飲酒と薬について正しいのは？',['どの薬でも問題ない','薬によって作用・副作用が強まることがある','必ず薬効がなくなる','水の代わりになる'],1,'眠気・ふらつきなどが強くなる薬もあります。飲酒の可否は薬ごとに確認しましょう。'],
['市販薬','市販のかぜ薬を選ぶ前に確認したいことは？',['処方薬との重複や持病','色だけ','広告だけ','値段だけ'],0,'成分が処方薬と重複することがあります。持病や服用中の薬を伝えてください。'],
['市販薬','解熱鎮痛薬を複数種類、自己判断で一緒に飲んでよい？',['原則として避け、確認する','必ずよい','子どもだけよい','空腹時ならよい'],0,'成分の重複や副作用のリスクがあります。併用前に相談してください。'],
['抗菌薬','抗菌薬を処方どおり使う大切な理由は？',['自己判断の中断を避け、適切な治療につなげるため','味を良くするため','眠気を防ぐため','ビタミンになるため'],0,'症状が軽くなっても、自己判断で中止せず医師・薬剤師の指示に従いましょう。'],
['抗菌薬','抗菌薬は、ウイルスによるかぜに必ず効く？',['必ず効く','原則として効かない','熱があれば必ず効く','予防に毎日飲む'],1,'抗菌薬は細菌に対する薬です。ウイルス感染症には原則として効果がありません。'],
['家族と安全','子どもが誤って薬を飲んだかもしれない時は？',['様子を見るだけ','薬の名前・量を確認し、すぐに相談窓口や医療機関へ連絡する','牛乳を飲ませる','吐かせる'],1,'無理に吐かせず、薬の情報を手元にして速やかに専門窓口や医療機関へ相談してください。'],
['家族と安全','薬を子どもの手の届かない場所に置く理由は？',['誤飲を防ぐため','薬を強くするため','期限を延ばすため','色を変えるため'],0,'子どもは身近な物を口にすることがあります。保管場所を決めておきましょう。']
];
// 各分野の基礎問題を組み合わせ、全100問から毎回ランダムに出題します。
const bank=Array.from({length:100},(_,i)=>{const q=[...facts[i%facts.length]];q.id=i;return q});let quiz=[];let qi=0;let score=0;
$('#start-quiz').onclick=()=>{const pool=selectedCat==='ぜんぶ'?bank:bank.filter(q=>q[0]===selectedCat);quiz=[...pool].sort(()=>Math.random()-.5).slice(0,10);if(quiz.length<10)quiz=[...bank].sort(()=>Math.random()-.5).slice(0,10);qi=0;score=0;$('#quiz-start').hidden=true;$('#quiz-play').hidden=false;showQuestion();};
function showQuestion(){const q=quiz[qi];$('#quiz-play').innerHTML=`<div class="question"><p>${qi+1} / ${quiz.length}</p><h2>${q[1]}</h2><div class="choices">${q[2].map((x,i)=>`<button data-i="${i}">${x}</button>`).join('')}</div><div class="explain" hidden></div></div>`;$('.choices').onclick=e=>{if(e.target.tagName!=='BUTTON')return;const i=+e.target.dataset.i;const buttons=$$('.choices button');buttons.forEach((b,n)=>{b.disabled=true;b.className=n===q[3]?'correct':n===i?'wrong':''});if(i===q[3])score++;const ex=$('.explain');ex.hidden=false;ex.innerHTML=`<strong>${i===q[3]?'正解！':'解説'}</strong><br>${q[4]}<br><button class="primary" id="next-q">${qi===quiz.length-1?'結果を見る':'次の問題へ'}</button>`;$('#next-q').onclick=()=>{qi++;qi<quiz.length?showQuestion():showScore();};};}
function showScore(){$('#quiz-play').innerHTML=`<div class="question"><h2>${quiz.length}問中 ${score}問 正解！</h2><p class="lead">迷いやすいところは、薬局で気軽に確認してね。</p><button class="primary" id="retry">もう一度挑戦する</button></div>`;$('#retry').onclick=()=>{$('#quiz-play').hidden=true;$('#quiz-start').hidden=false;};}

const labs=[
['TP','総たんぱく','肝臓・栄養','6.5〜7.9 g/dL'],['Alb','アルブミン','肝臓・栄養','3.9 g/dL以上'],['Cr','クレアチニン','腎臓・尿','男性1.00以下／女性0.70以下 mg/dL'],['eGFR','推算糸球体ろ過量','腎臓・尿','60.0以上 mL/分/1.73㎡'],['UA','尿酸','腎臓・尿','2.1〜7.0 mg/dL'],['HDL-C','HDLコレステロール','脂質','40 mg/dL以上'],['LDL-C','LDLコレステロール','脂質','60〜119 mg/dL'],['non-HDL','Non-HDLコレステロール','脂質','90〜149 mg/dL'],['TG','中性脂肪','脂質','30〜149 mg/dL（空腹時）'],['AST','AST（GOT）','肝臓・栄養','30 U/L以下'],['ALT','ALT（GPT）','肝臓・栄養','30 U/L以下'],['γ-GT','γ-GT（γ-GTP）','肝臓・栄養','50 U/L以下'],['FPG','空腹時血糖','血糖','70〜99 mg/dL'],['HbA1c','ヘモグロビンA1c','血糖','5.5％以下'],['WBC','白血球数','血球・炎症','3.1〜8.4 ×10³/µL'],['Hb','血色素量（ヘモグロビン）','血球・炎症','男性13.1〜16.3／女性12.1〜14.5 g/dL'],['PLT','血小板数','血球・炎症','14.5〜32.9 ×10⁴/µL'],['CRP','C反応性たんぱく','血球・炎症','0.30 mg/dL以下'],['PRO','尿蛋白','腎臓・尿','（−）陰性'],['BLD','尿潜血','腎臓・尿','（−）陰性'],['GLU','尿糖','腎臓・尿','（−）陰性'],['BUN','尿素窒素','腎臓・尿','8〜20 mg/dL程度'],['Cys-C','シスタチンC','腎臓・尿','男性0.63〜0.95／女性0.56〜0.87 mg/L程度'],['UACR','尿アルブミン／Cr比','腎臓・尿','30 mg/gCr未満'],['UPCR','尿蛋白／Cr比','腎臓・尿','0.15 g/gCr未満程度'],['ALP','アルカリホスファターゼ','肝臓・栄養','38〜113 U/L程度'],['LD','LD（LDH）','肝臓・栄養','124〜222 U/L程度'],['T-Bil','総ビリルビン','肝臓・栄養','0.4〜1.5 mg/dL程度'],['ChE','コリンエステラーゼ','肝臓・栄養','男性240〜486／女性201〜421 U/L程度'],['RBC','赤血球数','血球・炎症','男性435〜555／女性386〜492 ×10⁴/µL程度'],['Ht','ヘマトクリット','血球・炎症','男性40.7〜50.1／女性35.1〜44.4％程度'],['MCV','平均赤血球容積','血球・炎症','83.6〜98.2 fL程度'],['MCH','平均赤血球Hb量','血球・炎症','27.5〜33.2 pg程度'],['MCHC','平均赤血球Hb濃度','血球・炎症','31.7〜35.3 g/dL程度'],['Neut','好中球','血球・炎症','40〜70％程度'],['Lymph','リンパ球','血球・炎症','20〜50％程度'],['Na','ナトリウム','電解質','138〜145 mmol/L程度'],['K','カリウム','電解質','3.6〜4.8 mmol/L程度'],['Cl','クロール（塩化物）','電解質','101〜108 mmol/L程度'],['Ca','カルシウム','電解質','8.8〜10.1 mg/dL程度'],['P','無機リン','電解質','2.7〜4.6 mg/dL程度'],['Fe','血清鉄','鉄・ビタミン','男性54〜181／女性43〜172 µg/dL程度'],['Ferritin','フェリチン','鉄・ビタミン','結果票の範囲を優先'],['Vit.B12','ビタミンB12','鉄・ビタミン','233〜914 pg/mL程度'],['Folate','葉酸','鉄・ビタミン','4.0 ng/mL以上程度'],['AMY','アミラーゼ','膵臓・筋肉','44〜132 U/L程度'],['Lipase','リパーゼ','膵臓・筋肉','13〜55 U/L程度'],['CK','クレアチンキナーゼ','膵臓・筋肉','男性59〜248／女性41〜153 U/L程度'],['PT-INR','プロトロンビン時間INR','血液の固まり','0.85〜1.15程度'],['APTT','活性化部分トロンボプラスチン時間','血液の固まり','24〜38秒程度']
];let labCat='すべて';const lc=['すべて',...new Set(labs.map(x=>x[2]))];$('#lab-categories').innerHTML=lc.map(c=>`<button class="${c==='すべて'?'selected':''}" data-lab-cat="${c}">${c}</button>`).join('');
function renderLabs(){const term=$('#lab-search').value.toLowerCase();const list=labs.filter(x=>(labCat==='すべて'||x[2]===labCat)&&x.join(' ').toLowerCase().includes(term));$('#lab-count').textContent=list.length;$('#lab-list').innerHTML=list.map(x=>`<article class="lab"><div class="lab-top"><span class="code">${x[0]}</span><strong>${x[1]}</strong><span class="cat">${x[2]}</span></div><div class="range">${x[3]}</div><div class="detail">一般的な成人の目安です。結果票の基準範囲を優先し、気になる時は医師・薬剤師へ相談してください。</div></article>`).join('');}
$('#lab-search').oninput=renderLabs;$('#lab-categories').onclick=e=>{if(!e.target.dataset.labCat)return;labCat=e.target.dataset.labCat;$$('#lab-categories button').forEach(b=>b.classList.toggle('selected',b.dataset.labCat===labCat));renderLabs();};renderLabs();
