const config = window.MATHE_CONFIG || {};
const topics = [
 {label:'DIE BASIS FÜR KLEINE ENTDECKER',title:'Zahlen werden zu Freunden.',description:'Mit Mengen und Zahlen beginnen, Zusammenhänge entdecken und Schritt für Schritt sicherer werden.',items:['Zählen und Mengen zuordnen','Zahlen vergleichen und ordnen','Zahlen zerlegen und zusammensetzen','Zehner, Einer und Zahlenbeziehungen'],numbers:['1','2','3','4','5']},
 {label:'VIELE WEGE FÜHREN ZUM ERGEBNIS',title:'Rechnen mit Aha-Effekt.',description:'Plus und Minus verstehen, Rechenwege ausprobieren und Ergebnisse prüfen. Von einfachen Schritten bis zu neuen Herausforderungen.',items:['Addieren und subtrahieren','Zahlenmauern ergänzen','Zahlenfamilien entdecken','Gruppieren und verteilen'],numbers:['3','+','2','=','5']},
 {label:'FÜR KLEINE KNOBELKÖPFE',title:'Muster finden. Weiterdenken.',description:'Genau hinsehen, Regeln erkennen und eigene Ideen entwickeln. Hier zählt auch die Erklärung zum Lösungsweg.',items:['Zahlenfolgen fortsetzen','Regeln und Muster erkennen','Geheime Bildzahlen entschlüsseln','Behauptungen überprüfen'],numbers:['2','4','6','8','10']},
 {label:'MIT FORMEN AUF ENTDECKUNGSREISE',title:'Die Welt hat viele Formen.',description:'Geometrische Formen vergleichen und Wege beschreiben. Räumliches Denken wird zu einer Entdeckungsmission.',items:['Formen und Ecken untersuchen','Formenmuster ergänzen','Koordinaten zuordnen','Wege beschreiben und umkehren'],numbers:['△','□','○','◇','☆']},
 {label:'MATHE MITTEN IM ALLTAG',title:'Messen. Planen. Verstehen.',description:'Längen, Zeit, Geld und Kalender entdecken. Die Geldaufgaben nutzen fiktive Spielpreise zum gemeinsamen Üben.',items:['Längen und Gewichte vergleichen','Uhrzeiten und Stunden bestimmen','Mit Euro-Beträgen rechnen','Wochentage und Kalender erkunden'],numbers:['1','2','€','3','4']},
 {label:'SAMMELN, ORDNEN UND BEGRÜNDEN',title:'Aus Zahlen werden Geschichten.',description:'Informationen in Tabellen entdecken, Mengen vergleichen und eigene Datensammlungen erfinden.',items:['Tabellen lesen und ergänzen','Werte miteinander vergleichen','Daten nach Bedingungen auswählen','Eigene Lösungen entwickeln'],numbers:['4','7','2','5','8']}
];
const tabs=[...document.querySelectorAll('[data-topic]')];
function selectTopic(index, focus=false){
 const topic=topics[index];
 tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
 document.getElementById('topic-panel').setAttribute('aria-labelledby',`tab-${index}`);
 document.getElementById('topic-label').textContent=topic.label;
 document.getElementById('topic-title').textContent=topic.title;
 document.getElementById('topic-description').textContent=topic.description;
 const list=document.getElementById('topic-items'); list.replaceChildren(...topic.items.map(item=>{const li=document.createElement('li');li.textContent=item;return li;}));
 document.querySelectorAll('.number-row>span').forEach((span,i)=>{span.textContent=topic.numbers[i];if(i===4){const small=document.createElement('small');small.textContent='Geschafft! ✦';span.append(small);}});
 if(focus)tabs[index].focus();
}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTopic(i));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectTopic(next,true);}});});
document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-answer]').forEach(b=>{b.classList.remove('correct','incorrect');b.removeAttribute('aria-pressed');});
 const correct=button.dataset.answer==='9';button.classList.add(correct?'correct':'incorrect');button.setAttribute('aria-pressed','true');
 document.getElementById('mission-feedback').textContent=correct?'Geschafft! 6 + 3 = 9. Dein Schatz ist um 3 Diamanten gewachsen.':'Fast! Zähle von 6 weiter: 7, 8, 9. Welche Zahl passt? Versuch es noch einmal.';
}));
const pageDialog=document.getElementById('page-dialog');
document.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('large-preview').src=`assets/worksheet-${button.dataset.page}.jpg`;document.getElementById('large-preview').alt=button.querySelector('img').alt;document.getElementById('preview-caption').textContent=`Original-Arbeitsblatt · Seite ${button.dataset.page} von 72`;pageDialog.showModal();}));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{document.body.style.overflow='';});});
function openInfo(title,paragraphs,withSample=false){
 document.getElementById('info-title').textContent=title;
 const content=document.getElementById('info-content');content.replaceChildren();
 paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;content.append(p);});
 if(withSample){const link=document.createElement('a');link.href='assets/mathe-leseprobe.pdf';link.download='Mathe-Abenteuer-Leseprobe.pdf';link.className='button primary';link.textContent='Kostenlose Leseprobe herunterladen ↓';content.append(link);}
 document.getElementById('info-dialog').showModal();
}
let checkoutUrl='';
try{const url=new URL(config.checkoutUrl);if(url.protocol==='https:')checkoutUrl=url.href;}catch{}
if(checkoutUrl)document.getElementById('checkout-status').textContent='Du wirst zum Zahlungsanbieter weitergeleitet.';
document.querySelectorAll('.purchase-button').forEach(button=>button.addEventListener('click',()=>{
 if(checkoutUrl){window.location.assign(checkoutUrl);return;}
 openInfo('Dein Abenteuer startet bald.',['Der Kauf des kompletten E-Books für 5,99 € ist noch nicht freigeschaltet.','Bis dahin kannst du drei originale Arbeitsblätter und die passenden Lösungsseiten kostenlos ausprobieren.'],true);
}));
document.querySelectorAll('[data-legal]').forEach(button=>button.addEventListener('click',()=>{
 if(button.dataset.legal==='impressum'){
  const seller=config.seller||{};
  openInfo('Impressum',seller.name&&seller.address?[seller.name,seller.address,...(seller.registration?[seller.registration]:[]),...(config.contactEmail?[config.contactEmail]:[])]:['Diese Seite befindet sich in Vorbereitung. Die Angaben zum Anbieter werden vor Freischaltung des Verkaufs ergänzt.']);
 }else if(button.dataset.legal==='contact'){
  openInfo('Kontakt',config.contactEmail?[`Du erreichst uns unter: ${config.contactEmail}`]:['Die Kontaktinformationen werden vor dem Verkaufsstart ergänzt. Die kostenlose Leseprobe kannst du bereits herunterladen.'],!config.contactEmail);
 }else{
  openInfo('Datenschutz – Vorbereitung',['Diese Vorschauseite verwendet im Seitencode keine Analyse- oder Werbe-Tracker und setzt selbst keine Cookies. Interaktive Antworten werden nicht gespeichert.','Die Schriftdateien werden direkt mit der Seite ausgeliefert. Beim Seitenaufruf können technische Verbindungsdaten an den Hostinganbieter übermittelt werden.','Die vollständigen Angaben zum Verantwortlichen und zur Datenverarbeitung werden vor dem Verkaufsstart ergänzt.']);
 }
}));
if('IntersectionObserver' in window){const sticky=document.getElementById('mobile-offer');let pastHero=false;let offerVisible=false;const update=()=>sticky.classList.toggle('visible',pastHero&&!offerVisible&&!document.querySelector('dialog[open]'));new IntersectionObserver(([entry])=>{pastHero=!entry.isIntersecting&&entry.boundingClientRect.bottom<0;update();}).observe(document.querySelector('.hero'));new IntersectionObserver(([entry])=>{offerVisible=entry.isIntersecting;update();},{threshold:.1}).observe(document.getElementById('angebot'));}
