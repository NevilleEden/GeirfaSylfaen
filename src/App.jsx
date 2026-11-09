import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Layers,
  Keyboard,
  ArrowLeftRight,
  Check,
  Flame,
  RotateCcw,
  Loader2,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";

/* ---------------------------------------------------------------
   Geirfa Sylfaen — word data
   Compiled from the vocabulary of "Sylfaen y Gogledd" (argraffiad 2025):
   the alphabetical glossary at the back of the book, plus a few words
   that appear only in the unit vocabulary boxes. Gender (g) and plurals
   (note) are as printed in the book; entries marked "gwr./ben." can be
   either gender. Words marked "De Cymru" are southern forms.
--------------------------------------------------------------- */
const WORDS = [
  { cy: "acen", en: "an accent", type: "noun", g: "f", note: "pl. acenion" },
  { cy: "actio", en: "to act", type: "verb", note: "bôn: acti-" },
  { cy: "achos", en: "a cause, a case (legal)", type: "noun", g: "m", note: "pl. achosion" },
  { cy: "achub", en: "to save, to rescue", type: "verb", note: "bôn: achub-" },
  { cy: "adeilad", en: "a building", type: "noun", g: "m", note: "pl. adeiladau" },
  { cy: "aderyn", en: "a bird", type: "noun", g: "m", note: "pl. adar" },
  { cy: "adloniant", en: "entertainment", type: "noun", g: "m", note: "pl. adloniannau" },
  { cy: "adroddiad", en: "a report", type: "noun", g: "m", note: "pl. adroddiadau" },
  { cy: "addas", en: "suitable", type: "word" },
  { cy: "addurno", en: "to decorate", type: "verb", note: "bôn: addurn-" },
  { cy: "addysg", en: "education", type: "noun", g: "f" },
  { cy: "aelod", en: "a member", type: "noun", g: "m", note: "pl. aelodau" },
  { cy: "agos", en: "near", type: "word" },
  { cy: "anghytuno", en: "to disagree (with)", type: "verb", note: "bôn: anghytun-; + â" },
  { cy: "angladd", en: "a funeral", type: "noun", note: "gwr./ben.; pl. angladdau" },
  { cy: "Albanes", en: "Scottish woman", type: "noun", g: "f", note: "pl. Albanesau" },
  { cy: "Albanwr", en: "Scot", type: "noun", g: "m", note: "pl. Albanwyr" },
  { cy: "Almaen", en: "Germany", type: "noun", g: "f", note: "yr Almaen" },
  { cy: "Almaeneg", en: "German (language", type: "noun", g: "f" },
  { cy: "Almaenes", en: "German woman", type: "noun", g: "f", note: "pl. Almaenesau" },
  { cy: "Almaenwr", en: "German (man)", type: "noun", g: "m", note: "pl. Almaenwyr" },
  { cy: "allwedd", en: "a key", type: "noun", g: "f", note: "pl. allweddi" },
  { cy: "Americanes", en: "American woman", type: "noun", g: "f", note: "pl. Americanesau" },
  { cy: "Americanwr", en: "American (man)", type: "noun", g: "m", note: "pl. Americanwyr" },
  { cy: "amlen", en: "an envelope", type: "noun", g: "f", note: "pl. amlenni" },
  { cy: "amserlen", en: "a timetable", type: "noun", g: "f", note: "pl. amserlenni" },
  { cy: "amyneddgar", en: "patient (ans.", type: "word" },
  { cy: "anabl", en: "disabled", type: "word" },
  { cy: "anhygoel", en: "incredible", type: "word" },
  { cy: "anobeithiol", en: "hopeless", type: "word" },
  { cy: "antur", en: "an adventure", type: "noun", g: "f", note: "pl. anturiau" },
  { cy: "anturus", en: "adventurous", type: "word" },
  { cy: "ar ben fy hun", en: "on my own", type: "idiom", note: "Gogledd Cymru" },
  { cy: "ar bwys", en: "near (De Cymru", type: "idiom" },
  { cy: "archebu", en: "to book, to reserve, to order", type: "verb", note: "bôn: archeb-" },
  { cy: "archfarchnad", en: "a supermarket", type: "noun", g: "f", note: "pl. archfarchnadoedd" },
  { cy: "ardal", en: "an area", type: "noun", g: "f", note: "pl. ardaloedd" },
  { cy: "ar fai", en: "to blame, at fault", type: "verb" },
  { cy: "arfordir", en: "a coast", type: "noun", g: "m", note: "pl. arfordiroedd" },
  { cy: "ar fy mhen fy hun", en: "on my own", type: "idiom", note: "De Cymru" },
  { cy: "arian", en: "money; silver", type: "noun", g: "m" },
  { cy: "arian parod", en: "cash", type: "noun", g: "m" },
  { cy: "ar-lein", en: "online", type: "word" },
  { cy: "arlunio", en: "to draw, to paint (a picture)", type: "verb", note: "bôn: arluni-" },
  { cy: "ar ran", en: "on behalf of", type: "idiom" },
  { cy: "arswyd", en: "horror", type: "noun", g: "m" },
  { cy: "ar wahân", en: "separate (ans.", type: "idiom" },
  { cy: "ar yr un pryd", en: "at the same time", type: "idiom" },
  { cy: "astudio", en: "to study", type: "verb", note: "bôn: astudi-" },
  { cy: "atig", en: "an attic", type: "noun", g: "f", note: "pl. atigau" },
  { cy: "awr ginio", en: "lunch hour", type: "noun", g: "f" },
  { cy: "awyr", en: "air; sky", type: "noun", g: "f" },
  { cy: "balch", en: "proud, pleased", type: "word" },
  { cy: "bale", en: "ballet", type: "noun", g: "m" },
  { cy: "balŵn", en: "a balloon", type: "noun", g: "m", note: "pl. balwnau" },
  { cy: "baner", en: "a flag, a banner", type: "noun", g: "f", note: "pl. baneri" },
  { cy: "bant â ni", en: "off we go (De Cymru", type: "idiom" },
  { cy: "bardd", en: "a poet", type: "noun", g: "m", note: "pl. beirdd" },
  { cy: "barf", en: "a beard", type: "noun", g: "f", note: "pl. barfau" },
  { cy: "bas", en: "bass, (adj.) shallow", type: "noun", g: "m" },
  { cy: "bedd", en: "a grave", type: "noun", g: "m", note: "pl. beddau" },
  { cy: "beicio", en: "to cycle, to ride a bicycle", type: "verb", note: "bôn: beici-" },
  { cy: "bin", en: "a bin", type: "noun", g: "m", note: "pl. biniau" },
  { cy: "bioleg", en: "biology", type: "noun", g: "f" },
  { cy: "blaen", en: "front", type: "noun", g: "m" },
  { cy: "blasu", en: "to taste", type: "verb", note: "bôn: blas-" },
  { cy: "blasus", en: "tasty", type: "word" },
  { cy: "blawd", en: "flour", type: "noun", g: "m" },
  { cy: "blewog", en: "hairy", type: "word" },
  { cy: "blog", en: "a blog", type: "noun", g: "m", note: "pl. blogiau" },
  { cy: "blogio", en: "to blog", type: "verb", note: "bôn: blogi-" },
  { cy: "blows", en: "a blouse", type: "noun", g: "f", note: "pl. blowsus" },
  { cy: "bob yn ail", en: "every other, alternate", type: "idiom" },
  { cy: "bocs bwyd", en: "a food box", type: "noun", g: "m", note: "pl. bocsys bwyd" },
  { cy: "boch", en: "a cheek", type: "noun", g: "f", note: "pl. bochau" },
  { cy: "bochdew", en: "a hamster", type: "noun", g: "m", note: "pl. bochdewion" },
  { cy: "bodlon", en: "willing, contented, satisfied", type: "word" },
  { cy: "boeler", en: "a boiler", type: "noun", g: "m", note: "pl. boeleri" },
  { cy: "bôn", en: "a base, a stem", type: "noun", g: "m", note: "pl. bonion" },
  { cy: "botwm", en: "a button", type: "noun", g: "m", note: "pl. botymau" },
  { cy: "braidd", en: "rather, scarcely", type: "word" },
  { cy: "brest", en: "a chest", type: "noun", g: "f", note: "pl. brestiau" },
  { cy: "bresychen", en: "a cabbage", type: "noun", g: "f", note: "pl. bresych" },
  { cy: "busnes", en: "a business", type: "noun", g: "m", note: "pl. busnesau" },
  { cy: "buwch", en: "a cow", type: "noun", g: "f", note: "pl. buchod" },
  { cy: "bwced", en: "a bucket", type: "noun", g: "m", note: "pl. bwcedi" },
  { cy: "bwcio", en: "to book", type: "verb", note: "bôn: bwci-" },
  { cy: "bwrw cesair", en: "to hail (De Cymru", type: "verb" },
  { cy: "bwrw cenllysg", en: "to hail (Gogledd Cymru", type: "verb" },
  { cy: "bwthyn", en: "a cottage", type: "noun", g: "m", note: "pl. bythynnod" },
  { cy: "bwydo", en: "to feed", type: "verb", note: "bôn: bwyd-" },
  { cy: "bwystfil", en: "a monster", type: "noun", g: "m", note: "pl. bwystfilod" },
  { cy: "byw", en: "alive; live", type: "word", note: "+ ans." },
  { cy: "bywyd", en: "a life", type: "noun", g: "m", note: "pl. bywydau" },
  { cy: "cadair olwyn", en: "a wheelchair", type: "noun", g: "f", note: "pl. cadeiriau olwyn" },
  { cy: "cadno", en: "a fox", type: "noun", g: "m", note: "pl. cadnoid" },
  { cy: "cadw mewn cysylltiad", en: "to keep in touch", type: "verb", note: "bôn: cadw- mewn cysylltiad" },
  { cy: "cae", en: "a field", type: "noun", g: "m", note: "pl. caeau" },
  { cy: "cais", en: "an application / a rugby try", type: "noun", g: "m", note: "pl. ceisiadau; pl. ceisiau" },
  { cy: "caled", en: "hard", type: "word" },
  { cy: "calon", en: "a heart", type: "noun", g: "f", note: "pl. calonnau" },
  { cy: "call", en: "sensible", type: "word" },
  { cy: "camp", en: "a feat", type: "noun", g: "f", note: "pl. campau" },
  { cy: "campio", en: "to camp", type: "verb", note: "bôn: campi-" },
  { cy: "cangarŵ", en: "a kangaroo", type: "noun", g: "m", note: "pl. cangarŵod" },
  { cy: "canol dydd", en: "midday", type: "idiom" },
  { cy: "canolog", en: "central", type: "word" },
  { cy: "canrif", en: "a century", type: "noun", g: "f", note: "pl. canrifoedd" },
  { cy: "canslo", en: "to cancel", type: "verb", note: "bôn: cansl-" },
  { cy: "cantores", en: "a female singer", type: "noun", g: "f", note: "pl. cantoresau" },
  { cy: "canwr", en: "a singer", type: "noun", g: "m", note: "pl. cantorion" },
  { cy: "carafán", en: "a caravan", type: "noun", g: "f", note: "pl. carafanau" },
  { cy: "cardigan", en: "a cardigan", type: "noun", g: "f", note: "pl. cardiganau" },
  { cy: "caredig", en: "kind", type: "word" },
  { cy: "carped", en: "a carpet", type: "noun", g: "m", note: "pl. carpedi" },
  { cy: "cartŵn", en: "a cartoon", type: "noun", g: "m", note: "pl. cartwnau" },
  { cy: "cas beth", en: "a pet hate", type: "noun", g: "m", note: "pl. cas bethau" },
  { cy: "cas pensiliau", en: "a pencil case", type: "noun", g: "m", note: "pl. casys pensiliau" },
  { cy: "castell", en: "a castle", type: "noun", g: "m", note: "pl. cestyll" },
  { cy: "castell neidio", en: "a bouncy castle", type: "noun", g: "m" },
  { cy: "cefn gwlad", en: "the countryside", type: "noun", g: "m" },
  { cy: "cefndir", en: "background", type: "noun", g: "m", note: "pl. cefndiroedd" },
  { cy: "ceiliog", en: "a cockerel", type: "noun", g: "m", note: "pl. ceiliogod" },
  { cy: "ceisio", en: "to try, to attempt", type: "verb", note: "bôn: ceisi-" },
  { cy: "celf", en: "art", type: "noun", g: "f", note: "pl. celfyddydau" },
  { cy: "celfi", en: "furniture (gw. celficyn) (De Cymru", type: "noun", note: "gw. celficyn" },
  { cy: "cemeg", en: "chemistry", type: "noun", g: "f" },
  { cy: "cerdyn credyd", en: "a credit card", type: "noun", g: "m", note: "pl. cardiau credyd" },
  { cy: "cerddorol", en: "musical (ans.", type: "word" },
  { cy: "cewyn", en: "a nappy", type: "noun", g: "m", note: "pl. cewynnau" },
  { cy: "cigydd", en: "a butcher", type: "noun", g: "m", note: "pl. cigyddion" },
  { cy: "cimwch", en: "a lobster", type: "noun", g: "m", note: "pl. cimychiaid" },
  { cy: "cinio", en: "a dinner", type: "noun", g: "m", note: "pl. ciniawau" },
  { cy: "cinio rhost", en: "a roast dinner", type: "noun", g: "m", note: "pl. ciniawau rhost" },
  { cy: "ciwb", en: "cube", type: "noun", g: "m", note: "pl. ciwbiau" },
  { cy: "clasurol", en: "classical", type: "word" },
  { cy: "clecs", en: "gossip", type: "word" },
  { cy: "clir", en: "clear", type: "word", note: "+ ans." },
  { cy: "clirio", en: "to clear", type: "verb", note: "bôn: cliri-" },
  { cy: "cloi", en: "to lock", type: "verb", note: "bôn: cloi-" },
  { cy: "coeden", en: "a tree", type: "noun", g: "f", note: "pl. coed" },
  { cy: "coeden deuluol", en: "a family tree", type: "noun", g: "f" },
  { cy: "coedwig", en: "a forest", type: "noun", g: "f", note: "pl. coedwigoedd" },
  { cy: "cofiant", en: "a biography", type: "noun", g: "m", note: "pl. cofiannau" },
  { cy: "cofion", en: "regards", type: "word" },
  { cy: "cofion cynnes", en: "warm regards", type: "idiom" },
  { cy: "cofrestru", en: "to register", type: "verb", note: "bôn: cofrestr-" },
  { cy: "coleg", en: "a college", type: "noun", g: "m", note: "pl. colegau" },
  { cy: "coll", en: "lost (ans.", type: "word" },
  { cy: "colli", en: "to lose", type: "verb", note: "bôn: coll-" },
  { cy: "comedi", en: "a comedy", type: "noun", g: "f", note: "pl. comedïau" },
  { cy: "copïo", en: "to copy", type: "verb", note: "bôn: copï-" },
  { cy: "corff", en: "a body", type: "noun", g: "m", note: "pl. cyrff" },
  { cy: "coridor", en: "a corridor", type: "noun", g: "m", note: "pl. coridorau" },
  { cy: "cornel", en: "a corner", type: "noun", g: "f", note: "pl. corneli" },
  { cy: "coron", en: "a crown", type: "noun", g: "f", note: "pl. coronau" },
  { cy: "corryn", en: "a spider", type: "noun", g: "m", note: "pl. corynnod" },
  { cy: "cost", en: "a cost", type: "noun", g: "f", note: "pl. costau" },
  { cy: "costio", en: "to cost", type: "verb", note: "bôn: costi-" },
  { cy: "crafu", en: "to scrape, to scratch", type: "verb", note: "bôn: craf-" },
  { cy: "craig", en: "a rock", type: "noun", g: "f", note: "pl. creigiau" },
  { cy: "cranc", en: "a crab", type: "noun", g: "m", note: "pl. crancod" },
  { cy: "creisionen", en: "a crisp", type: "noun", g: "f", note: "pl. creision" },
  { cy: "creulon", en: "cruel", type: "word" },
  { cy: "crïo", en: "to cry", type: "verb", note: "bôn: crï-" },
  { cy: "croen", en: "skin", type: "noun", g: "m", note: "pl. crwyn" },
  { cy: "croesair", en: "crossword", type: "noun", g: "m", note: "pl. croeseiriau" },
  { cy: "cropian", en: "to crawl", type: "verb", note: "bôn: cropi-" },
  { cy: "crys", en: "a shirt", type: "noun", g: "m", note: "pl. crysau" },
  { cy: "crys T", en: "a T shirt", type: "noun", g: "m" },
  { cy: "cusan", en: "a kiss", type: "noun", g: "f", note: "pl. cusanau" },
  { cy: "cusanu", en: "to kiss", type: "verb", note: "bôn: cusan-" },
  { cy: "cwch", en: "a boat", type: "noun", g: "m", note: "pl. cychod" },
  { cy: "cwmwl", en: "a cloud", type: "noun", g: "m", note: "pl. cymylau" },
  { cy: "cwningen", en: "a rabbit", type: "noun", g: "f", note: "pl. cwningod" },
  { cy: "cwpan", en: "a cup", type: "noun", g: "m", note: "pl. cwpanau" },
  { cy: "cwpwrdd", en: "a cupboard", type: "noun", g: "m", note: "pl. cypyrddau" },
  { cy: "cwrdd", en: "to meet (with) (bôn: cwrdd-) (De Cymru", type: "verb", note: "+ â" },
  { cy: "cwrt", en: "court (sports)", type: "noun", g: "m", note: "pl. cyrtiau" },
  { cy: "cwsmer", en: "a customer", type: "noun", g: "m", note: "pl. cwsmeriaid" },
  { cy: "cwt", en: "a hut", type: "noun", g: "m", note: "pl. cytiau" },
  { cy: "cwympo", en: "to fall (bôn: cwymp-) (De Cymru", type: "verb" },
  { cy: "cwyno", en: "to complain", type: "verb", note: "bôn: cwyn-" },
  { cy: "cydweithiwr", en: "a colleague", type: "noun", g: "m", note: "pl. cydweithwyr" },
  { cy: "cydweithwraig", en: "fem. colleague", type: "noun", g: "f", note: "pl. cydweithwragedd" },
  { cy: "cyfarfod", en: "to meet", type: "verb" },
  { cy: "cyfarwyddo", en: "to direct, to instruct", type: "verb", note: "bôn: cyfarwydd-" },
  { cy: "cyfeillgar", en: "friendly", type: "word" },
  { cy: "cyfeirio", en: "to direct (cyfeiri-", type: "verb" },
  { cy: "cyfle", en: "an opportunity, a chance", type: "noun", g: "m", note: "pl. cyfleoedd" },
  { cy: "cyfleus", en: "convenient", type: "word" },
  { cy: "cyflog", en: "a salary", type: "noun", g: "m", note: "pl. cyflogau" },
  { cy: "cyfoethog", en: "rich", type: "word" },
  { cy: "cyfreithiwr", en: "a solicitor", type: "noun", g: "m", note: "pl. cyfreithwyr" },
  { cy: "cyfrwng", en: "a medium", type: "noun", g: "m", note: "pl. cyfryngau" },
  { cy: "cyfryngau cymdeithasol", en: "social media", type: "idiom" },
  { cy: "cyffredin", en: "common", type: "word" },
  { cy: "cyffrous", en: "exciting", type: "word" },
  { cy: "cyhoeddi", en: "to announce, to publish", type: "verb", note: "bôn: cyhoedd-" },
  { cy: "cyhoeddiad", en: "an announcement", type: "noun", g: "m", note: "pl. cyhoeddiadau" },
  { cy: "cylch", en: "a circle", type: "noun", g: "m", note: "pl. cylchoedd" },
  { cy: "cylch meithrin", en: "a pre-school nursery", type: "idiom" },
  { cy: "cylchfan", en: "a roundabout", type: "noun", g: "f", note: "pl. cylchfannau" },
  { cy: "cylchgrawn", en: "a magazine", type: "noun", g: "m", note: "pl. cylchgronau" },
  { cy: "cyllell", en: "a knife", type: "noun", g: "f", note: "pl. cyllyll" },
  { cy: "cymdeithas", en: "a society", type: "noun", g: "f", note: "pl. cymdeithasau" },
  { cy: "cymdeithas rieni", en: "parents’ association", type: "noun", g: "f" },
  { cy: "cymdeithasu", en: "to socialise", type: "verb" },
  { cy: "cymeriad", en: "a character", type: "noun", g: "m", note: "pl. cymeriadau" },
  { cy: "Cymreig", en: "Welsh", type: "word", note: "+ ans." },
  { cy: "cymuned", en: "a community", type: "noun", g: "f", note: "pl. cymunedau" },
  { cy: "cynffon", en: "a tail", type: "noun", g: "f", note: "pl. cynffonnau" },
  { cy: "cynnig", en: "an offer", type: "noun", g: "m", note: "pl. cynigion" },
  { cy: "cynulleidfa", en: "an audience; a congregation", type: "noun", g: "f", note: "pl. cynulleidfaoedd" },
  { cy: "cyrliog", en: "curly", type: "word" },
  { cy: "cysylltiad", en: "a contact, a connection", type: "noun", g: "m", note: "pl. cysylltiadau" },
  { cy: "cysylltu", en: "to contact, to connect (with)", type: "verb", note: "bôn: cysyllt-; + â" },
  { cy: "cytundeb", en: "a contract", type: "noun", g: "m", note: "pl. cytundebau" },
  { cy: "cyw", en: "a chick", type: "noun", g: "m", note: "pl. cywion" },
  { cy: "cywir", en: "correct", type: "word" },
  { cy: "chwarae teg", en: "fair play", type: "idiom" },
  { cy: "chwaraewr", en: "a player", type: "noun", g: "m", note: "pl. chwaraewyr" },
  { cy: "chwerw", en: "bitter", type: "word" },
  { cy: "chwilio", en: "to search (for)", type: "verb", note: "bôn: chwili-; + am" },
  { cy: "chwyrnu", en: "to snore", type: "verb", note: "bôn: chwyrn-" },
  { cy: "chwys", en: "sweat", type: "noun", g: "m" },
  { cy: "chwysu", en: "to sweat", type: "verb", note: "bôn: chwys-" },
  { cy: "chwythu", en: "to blow", type: "verb", note: "bôn: chwyth-" },
  { cy: "daear", en: "earth", type: "noun", g: "f" },
  { cy: "daearyddiaeth", en: "geography", type: "noun", g: "f" },
  { cy: "dafad", en: "a sheep", type: "noun", g: "f", note: "pl. defaid" },
  { cy: "dart", en: "a dart", type: "noun", g: "m", note: "pl. dartiau" },
  { cy: "datblygu", en: "to develop", type: "verb" },
  { cy: "dathliad", en: "a celebration", type: "noun", g: "m", note: "pl. dathliadau" },
  { cy: "dawns", en: "a dance", type: "noun", g: "f", note: "pl. dawnsfeydd" },
  { cy: "dawnus", en: "talented", type: "word" },
  { cy: "dechreuwr", en: "a beginner", type: "noun", g: "m", note: "pl. dechreuwyr" },
  { cy: "derbyn", en: "to receive, to accept", type: "verb", note: "bôn: derbyni-" },
  { cy: "derbynfa", en: "a reception", type: "noun", g: "f", note: "pl. derbynfeydd" },
  { cy: "dibynnu", en: "to depend (upon), to rely on", type: "verb", note: "bôn: dibynn-; + ar" },
  { cy: "difetha", en: "to spoil, to destroy", type: "verb", note: "bôn: difeth-" },
  { cy: "diffodd", en: "to switch off, to extinguish", type: "verb", note: "bôn: diffodd-" },
  { cy: "digartref", en: "homeless", type: "word" },
  { cy: "digidol", en: "digital", type: "word" },
  { cy: "dilyn", en: "to follow", type: "verb", note: "bôn: dilyn-" },
  { cy: "dinas", en: "a city", type: "noun", g: "f", note: "pl. dinasoedd" },
  { cy: "diolch byth", en: "thank goodness", type: "idiom" },
  { cy: "diolchgar", en: "thankful, grateful", type: "word" },
  { cy: "disgrifio", en: "to describe", type: "verb", note: "bôn: disgrifi-" },
  { cy: "disgwyl", en: "to expect (disgwyli-", type: "verb" },
  { cy: "disgybl", en: "a pupil", type: "noun", g: "m", note: "pl. disgyblion" },
  { cy: "distaw", en: "quiet (Gogledd Cymru", type: "word" },
  { cy: "diswyddo", en: "to make redundant", type: "verb", note: "bôn: diswydd-" },
  { cy: "diwedd", en: "end", type: "noun", g: "m", note: "pl. diweddion" },
  { cy: "diweddar", en: "recent", type: "word" },
  { cy: "dod draw", en: "to come over", type: "verb" },
  { cy: "dogfen", en: "a document", type: "noun", g: "f", note: "pl. dogfennau" },
  { cy: "doli", en: "a doll", type: "noun", g: "f", note: "pl. doliau" },
  { cy: "doniol", en: "funny, comical, amusing", type: "word" },
  { cy: "draig", en: "a dragon", type: "noun", g: "f", note: "pl. dreigiau" },
  { cy: "drôr", en: "a drawer", type: "noun", g: "m", note: "pl. droriau" },
  { cy: "dros", en: "over", type: "word" },
  { cy: "drwm", en: "a drum", type: "noun", g: "m", note: "pl. drymiau" },
  { cy: "dŵad draw", en: "to come over", type: "verb" },
  { cy: "dwlu", en: "to love, to dote upon (bôn: dwl-) (De Cymru", type: "verb", note: "+ ar" },
  { cy: "dwywaith", en: "twice", type: "word" },
  { cy: "dydd", en: "a day", type: "noun", g: "m", note: "pl. dyddiau" },
  { cy: "dyddiad", en: "a date (as on a calendar)", type: "noun", g: "m", note: "pl. dyddiadau" },
  { cy: "dyddiadur", en: "a diary", type: "noun", g: "m", note: "pl. dyddiaduron" },
  { cy: "dyfodol", en: "future", type: "noun", g: "m" },
  { cy: "dyffryn", en: "a valley", type: "noun", g: "m", note: "pl. dyffrynnoedd" },
  { cy: "dyna i gyd", en: "that’s all", type: "idiom" },
  { cy: "ebostio", en: "to email", type: "verb", note: "bôn: ebosti-" },
  { cy: "egwyl", en: "a break, break time", type: "noun", g: "f" },
  { cy: "Eidal", en: "Italy", type: "noun", g: "f", note: "yr Eidal" },
  { cy: "Eidalaidd", en: "Italian (ans.", type: "word" },
  { cy: "Eidaleg", en: "Italian (language", type: "noun", g: "f" },
  { cy: "Eidales", en: "Italian woman", type: "noun", g: "f", note: "pl. Eidalesau" },
  { cy: "Eidalwr", en: "Italian man", type: "noun", g: "m", note: "pl. Eidalwyr" },
  { cy: "eiliad", en: "a second (of time)", type: "noun", note: "gwr./ben.; pl. eiliadau" },
  { cy: "eitem", en: "an item", type: "noun", g: "f", note: "pl. eitemau" },
  { cy: "eleni", en: "this year", type: "word" },
  { cy: "eli haul", en: "suncream", type: "noun", g: "m" },
  { cy: "eliffant", en: "an elephant", type: "noun", g: "m", note: "pl. eliffantod" },
  { cy: "elusen", en: "a charity", type: "noun", g: "f", note: "pl. elusennau" },
  { cy: "emyn", en: "a hymn", type: "noun", g: "m", note: "pl. emynau" },
  { cy: "er enghraifft", en: "for example", type: "idiom" },
  { cy: "erbyn", en: "by (time", type: "prep" },
  { cy: "erbyn hyn", en: "by now", type: "idiom" },
  { cy: "Eryri", en: "Snowdonia", type: "noun", g: "f" },
  { cy: "esbonio", en: "to explain", type: "verb", note: "bôn: esboni-" },
  { cy: "Ewrop", en: "Europe", type: "noun", g: "f" },
  { cy: "fest", en: "a vest", type: "noun", g: "f", note: "pl. festiau" },
  { cy: "fyny grisiau", en: "upstairs (Gogledd Cymru", type: "idiom" },
  { cy: "ffa pob", en: "baked beans", type: "idiom" },
  { cy: "ffafr", en: "a favour", type: "noun", g: "f", note: "pl. ffafrau" },
  { cy: "ffaith", en: "a fact", type: "noun", g: "f", note: "pl. ffeithiau" },
  { cy: "ffansïo", en: "to fancy", type: "verb", note: "bôn: ffansï-" },
  { cy: "ffantasi", en: "a fantasy", type: "noun", g: "m", note: "pl. ffantasïau" },
  { cy: "ffasiwn", en: "a fashion", type: "noun", g: "m", note: "pl. ffasiynau" },
  { cy: "ffasiynol", en: "fashionable", type: "word" },
  { cy: "ffeithiol", en: "factual", type: "word" },
  { cy: "fferi", en: "a ferry", type: "noun", g: "f", note: "pl. fferis" },
  { cy: "fferm", en: "a farm", type: "noun", g: "f", note: "pl. ffermydd" },
  { cy: "ffermdy", en: "a farmhouse", type: "noun", g: "m", note: "pl. ffermdai" },
  { cy: "ffeuen", en: "a bean", type: "noun", g: "f", note: "pl. ffa" },
  { cy: "ffi", en: "a fee", type: "noun", g: "f", note: "pl. ffioedd" },
  { cy: "ffiseg", en: "physics", type: "noun", g: "f" },
  { cy: "ffitio", en: "to fit", type: "verb", note: "bôn: ffiti-" },
  { cy: "fforc", en: "a fork", type: "noun", g: "f", note: "pl. ffyrc" },
  { cy: "ffordd", en: "a road, a way", type: "noun", g: "f", note: "pl. ffyrdd" },
  { cy: "ffordd osgoi", en: "a bypass (road)", type: "noun", g: "f", note: "pl. ffyrdd osgoi" },
  { cy: "Ffrangeg", en: "French (language", type: "noun", g: "f" },
  { cy: "Ffrainc", en: "France", type: "noun", g: "f" },
  { cy: "Ffrances", en: "French woman", type: "noun", g: "f", note: "pl. Ffrancesau" },
  { cy: "Ffrancwr", en: "Frenchman", type: "noun", g: "m", note: "pl. Ffrancwyr" },
  { cy: "ffres", en: "fresh", type: "word" },
  { cy: "ffrio", en: "to fry", type: "verb", note: "bôn: ffri-" },
  { cy: "ffrog", en: "a dress, a frock", type: "noun", g: "f", note: "pl. ffrogiau" },
  { cy: "ffŵl", en: "a fool", type: "noun", g: "m", note: "pl. ffyliaid" },
  { cy: "ffwrn", en: "an oven", type: "noun", g: "f", note: "pl. ffyrnau" },
  { cy: "gafr", en: "a goat", type: "noun", g: "f", note: "pl. geifr" },
  { cy: "gair o gyngor", en: "a word of advice", type: "idiom" },
  { cy: "galwad", en: "a call", type: "noun", g: "f", note: "pl. galwadau" },
  { cy: "gartre", en: "at home (De Cymru", type: "adv" },
  { cy: "gem", en: "a gem", type: "noun", g: "f", note: "pl. gemau" },
  { cy: "gemwaith", en: "jewellery", type: "noun", g: "m" },
  { cy: "geni", en: "to be born", type: "verb" },
  { cy: "ger", en: "near", type: "word" },
  { cy: "glân", en: "clean", type: "word" },
  { cy: "glanhäwr", en: "a cleaner", type: "noun", g: "m", note: "pl. glanhawyr" },
  { cy: "glo", en: "coal", type: "noun", g: "m" },
  { cy: "glöwr", en: "collier", type: "noun", g: "m", note: "pl. glowyr" },
  { cy: "gofalu", en: "to look after, to care (for)", type: "verb", note: "bôn: gofal-; + am" },
  { cy: "Gog", en: "a North Walian", type: "noun", g: "m", note: "pl. Gogs" },
  { cy: "gôl", en: "a goal", type: "noun", g: "f", note: "pl. goliau" },
  { cy: "golygfa", en: "a view, scenery", type: "noun", g: "f", note: "pl. golygfeydd" },
  { cy: "golygus", en: "handsome", type: "word" },
  { cy: "gorchymyn", en: "a command", type: "noun", g: "m", note: "pl. gorchmynion" },
  { cy: "gorffennol", en: "past", type: "noun", g: "m" },
  { cy: "gosod", en: "to put, to set", type: "verb", note: "bôn: gosod-" },
  { cy: "gradd", en: "a degree", type: "noun", g: "f", note: "pl. graddau" },
  { cy: "gratio", en: "to grate", type: "verb", note: "bôn: grati-" },
  { cy: "grawnfwyd", en: "cereal", type: "noun", g: "m", note: "pl. grawnfwydydd" },
  { cy: "grawnffrwyth", en: "a grapefruit", type: "noun", g: "m", note: "pl. grawnffrwythau" },
  { cy: "gris", en: "a step, a stair", type: "noun", g: "m", note: "pl. grisiau" },
  { cy: "grŵp", en: "a group", type: "noun", g: "m", note: "pl. grwpiau" },
  { cy: "gwaed", en: "blood", type: "noun", g: "m" },
  { cy: "gwael", en: "poor (quality); not well, ill", type: "word" },
  { cy: "gwaelod", en: "bottom, base", type: "noun", g: "m", note: "pl. gwaelodion" },
  { cy: "gwag", en: "empty", type: "word" },
  { cy: "gwahanol", en: "different", type: "word" },
  { cy: "gwahoddiad", en: "an invitation", type: "noun", g: "m", note: "pl. gwahoddiadau" },
  { cy: "gwarchod", en: "to protect, to babysit", type: "verb", note: "bôn: gwarchod-" },
  { cy: "gwario", en: "to spend (money)", type: "verb", note: "bôn: gwari-" },
  { cy: "gwartheg", en: "cattle/cows", type: "noun", g: "f" },
  { cy: "gwawr", en: "a dawn", type: "noun", g: "f", note: "pl. gwawriau" },
  { cy: "gweddïo", en: "to pray", type: "verb", note: "bôn: gweddï-" },
  { cy: "gwefan", en: "a website", type: "noun", g: "f", note: "pl. gwefannau" },
  { cy: "gweiddi", en: "to shout", type: "verb", note: "bôn: gwaedd-" },
  { cy: "gweinidog", en: "a minister", type: "noun", g: "m", note: "pl. gweindogion" },
  { cy: "gweinyddol", en: "administrative", type: "word" },
  { cy: "gweld eisiau", en: "to miss, to yearn for", type: "verb", note: "bôn: gwel- eisiau; De Cymru" },
  { cy: "gwella", en: "to improve, to get better", type: "verb", note: "bôn: gwell-" },
  { cy: "gwersyll", en: "a camp", type: "noun", g: "m", note: "pl. gwersylloedd" },
  { cy: "gwersylla", en: "to camp", type: "verb", note: "bôn: gwersyll-" },
  { cy: "gwirfoddol", en: "voluntary", type: "word" },
  { cy: "gwisg", en: "a costume, an uniform", type: "noun", g: "f", note: "pl. gwisgoedd" },
  { cy: "gwisg ffansi", en: "fancy dress", type: "noun", g: "f", note: "pl. gwisgoedd ffansi" },
  { cy: "gwiwer", en: "a squirrel", type: "noun", g: "f", note: "pl. gwiwerod" },
  { cy: "Gwlad Groeg", en: "Greece", type: "noun", g: "f" },
  { cy: "gwnïo", en: "to sew", type: "verb", note: "bôn: gwnï-" },
  { cy: "gwregys", en: "a belt", type: "noun", g: "m", note: "pl. gwregysau" },
  { cy: "gwres", en: "temperature, heat, heating", type: "noun", g: "m" },
  { cy: "gwres canolog", en: "central heating", type: "noun", g: "m" },
  { cy: "gwrthod", en: "to refuse", type: "verb", note: "bôn: gwrthod-" },
  { cy: "gwybodaeth", en: "information", type: "noun", g: "f" },
  { cy: "gwych", en: "excellent", type: "word" },
  { cy: "gwydr", en: "glass; a glass", type: "noun", g: "m", note: "pl. gwydrau" },
  { cy: "gwydraid", en: "a glassful", type: "noun", g: "m" },
  { cy: "gŵydd", en: "a goose", type: "noun", g: "f", note: "pl. gwyddau" },
  { cy: "Gwyddel", en: "Irishman", type: "noun", g: "m", note: "pl. Gwyddelod" },
  { cy: "Gwyddeleg", en: "Irish (language", type: "noun", g: "f" },
  { cy: "Gwyddeles", en: "Irish woman", type: "noun", g: "f", note: "pl. Gwyddelesau" },
  { cy: "Gwyddelig", en: "Irish (ans.", type: "word" },
  { cy: "gwyddoniaeth", en: "science", type: "noun", g: "f" },
  { cy: "Gŵyl San Steffan", en: "Boxing Day (The Feast of St Stephen", type: "noun", g: "f" },
  { cy: "gwylltio", en: "to lose one’s temper", type: "verb", note: "bôn: gwyllti-" },
  { cy: "haearn", en: "iron", type: "noun", g: "m" },
  { cy: "hamdden", en: "leisure", type: "noun", g: "m" },
  { cy: "hardd", en: "beautiful", type: "word" },
  { cy: "heb sôn am", en: "not to mention", type: "idiom" },
  { cy: "heibio", en: "past", type: "word" },
  { cy: "heini", en: "fit", type: "word" },
  { cy: "hen ffasiwn", en: "old-fashioned", type: "idiom" },
  { cy: "heulwen", en: "sunshine", type: "noun", g: "f" },
  { cy: "hiraeth", en: "longing (nostalgia", type: "noun", g: "m" },
  { cy: "hofrennydd", en: "a helicopter", type: "noun", g: "m", note: "pl. hofrenyddion" },
  { cy: "holl", en: "all, whole", type: "word" },
  { cy: "hollol", en: "complete", type: "word" },
  { cy: "hosan", en: "a sock", type: "noun", g: "f", note: "pl. hosanau" },
  { cy: "hunan", en: "self", type: "word" },
  { cy: "hunangofiant", en: "autobiography", type: "noun", g: "m", note: "pl. hunangofiannau" },
  { cy: "hwfro", en: "to hoover", type: "verb", note: "bôn: hwfr-" },
  { cy: "Hwntw", en: "a South Walian", type: "noun", g: "m", note: "pl. Hwntws" },
  { cy: "hwyaden", en: "a duck", type: "noun", g: "f", note: "pl. hwyaid" },
  { cy: "hwylio", en: "to sail", type: "verb", note: "bôn: hwyli-" },
  { cy: "hyd yn oed", en: "even", type: "idiom" },
  { cy: "hyderus", en: "confident", type: "word" },
  { cy: "hyfforddi", en: "to train", type: "verb", note: "bôn: hyffordd-" },
  { cy: "hyfforddiant", en: "training, coaching", type: "noun", g: "m" },
  { cy: "hyfforddwr", en: "a coach, a trainer", type: "noun", g: "m", note: "pl. hyfforddwyr" },
  { cy: "hysbysebu", en: "to advertise", type: "verb", note: "bôn: hysbyseb-" },
  { cy: "iach", en: "healthy", type: "word" },
  { cy: "iaith", en: "a language", type: "noun", g: "f", note: "pl. ieithoedd" },
  { cy: "iâr", en: "a hen", type: "noun", g: "f", note: "pl. ieir" },
  { cy: "iogwrt", en: "a yoghurt", type: "noun", g: "m" },
  { cy: "isel", en: "low", type: "word" },
  { cy: "jar", en: "a jar", type: "noun", g: "f", note: "pl. jariau" },
  { cy: "jeli", en: "jelly", type: "noun", g: "m" },
  { cy: "jiráff", en: "a giraffe", type: "noun", g: "m", note: "pl. jiraffod" },
  { cy: "lan lofft", en: "upstairs (De Cymru", type: "idiom" },
  { cy: "lawnt", en: "a lawn", type: "noun", g: "f", note: "pl. lawntydd/lawntiau, lawr grisiau" },
  { cy: "lawr llawr", en: "downstairs (De Cymru", type: "idiom" },
  { cy: "lefel", en: "a level", type: "noun", g: "f", note: "pl. lefelau" },
  { cy: "lein", en: "a line", type: "noun", g: "f", note: "pl. leiniau" },
  { cy: "lori", en: "a lorry", type: "noun", g: "f", note: "pl. lorïau" },
  { cy: "llall", en: "other", type: "word", note: "pl. lleill" },
  { cy: "llaw", en: "a hand", type: "noun", g: "f", note: "pl. dwylo" },
  { cy: "lle", en: "a place", type: "noun", g: "m", note: "pl. llefydd/lleoedd" },
  { cy: "llefain", en: "to cry (bôn: llef-) (De Cymru", type: "verb" },
  { cy: "lleol", en: "local", type: "word" },
  { cy: "lleuad", en: "a moon", type: "noun", g: "f" },
  { cy: "llew", en: "a lion", type: "noun", g: "m", note: "pl. llewod" },
  { cy: "lliwgar", en: "colourful", type: "word" },
  { cy: "lliwio", en: "to colour", type: "verb", note: "bôn: lliwi-" },
  { cy: "llo", en: "a calf (cattle)", type: "noun", g: "m", note: "pl. lloi" },
  { cy: "llogi", en: "to hire, to rent", type: "verb", note: "bôn: llog-" },
  { cy: "llonydd", en: "still, tranquil / peace and quiet", type: "word", note: "+ ans." },
  { cy: "llosgi", en: "to burn", type: "verb", note: "bôn: llosg-" },
  { cy: "llungopïo", en: "to photocopy", type: "verb", note: "bôn: llungopï-" },
  { cy: "llwgu", en: "to starve", type: "verb", note: "bôn: llwg-" },
  { cy: "llwy", en: "a spoon", type: "noun", g: "f", note: "pl. llwyau" },
  { cy: "llwybr", en: "a path", type: "noun", g: "m", note: "pl. llwybrau" },
  { cy: "llwynog", en: "a fox", type: "noun", g: "m", note: "pl. llwynogod" },
  { cy: "llygoden", en: "a mouse", type: "noun", g: "f", note: "pl. llygod" },
  { cy: "llygoden fawr", en: "a rat", type: "noun", g: "f", note: "pl. llygod mawr" },
  { cy: "llym", en: "strict, sharp", type: "word" },
  { cy: "llysfam", en: "stepmother", type: "noun", g: "f", note: "pl. llysfamau" },
  { cy: "llysieuol", en: "vegetarian (ans.", type: "word" },
  { cy: "llystad", en: "stepfather", type: "noun", g: "m", note: "pl. llystadau" },
  { cy: "llythyr", en: "a letter (correspondence)", type: "noun", g: "m", note: "pl. llythyrau" },
  { cy: "llywodraeth", en: "a government", type: "noun", g: "f", note: "pl. llywodraethau" },
  { cy: "mab", en: "a son", type: "noun", g: "m", note: "pl. meibion" },
  { cy: "mae’n debyg", en: "it’s likely, apparently", type: "idiom" },
  { cy: "maes", en: "a field, an area", type: "noun", g: "m", note: "pl. meysydd" },
  { cy: "maes awyr", en: "airport", type: "noun", g: "m", note: "pl. meysydd awyr" },
  { cy: "maint", en: "a size", type: "noun", g: "m", note: "pl. meintiau" },
  { cy: "malwen", en: "a snail", type: "noun", g: "f", note: "pl. malwod" },
  { cy: "marw", en: "to die, (adj.) dead", type: "verb" },
  { cy: "materion cyfoes", en: "current affairs", type: "idiom" },
  { cy: "mathemateg", en: "mathematics", type: "noun", g: "f" },
  { cy: "meddai", en: "s/he said", type: "word" },
  { cy: "meddwi", en: "to get drunk", type: "verb", note: "bôn: meddw-" },
  { cy: "meicrodon", en: "a microwave", type: "noun", g: "m" },
  { cy: "meithrinfa", en: "a crèche, a nursery", type: "noun", g: "f", note: "pl. meithrinfeydd" },
  { cy: "melys", en: "sweet (ans.", type: "word" },
  { cy: "merch", en: "a girl, a daughter", type: "noun", g: "f", note: "pl. merched" },
  { cy: "milfeddyg", en: "a vet", type: "noun", g: "m", note: "pl. milfeddygon" },
  { cy: "milfeddygfa", en: "veterinary surgery", type: "noun", g: "f", note: "pl. milfeddygfeydd" },
  { cy: "milltir", en: "a mile", type: "noun", g: "f", note: "pl. milltiroedd" },
  { cy: "mochyn", en: "a pig", type: "noun", g: "m", note: "pl. moch" },
  { cy: "mochyn cwta", en: "a guinea pig", type: "noun", g: "m", note: "pl. moch cwta" },
  { cy: "modfedd", en: "an inch", type: "noun", g: "f", note: "pl. modfeddi" },
  { cy: "modrwy", en: "a ring", type: "noun", g: "f", note: "pl. modrwyau" },
  { cy: "moel", en: "bald", type: "word" },
  { cy: "mwg", en: "smoke", type: "noun", g: "m" },
  { cy: "mwnci", en: "a monkey", type: "noun", g: "m", note: "pl. mwncïod" },
  { cy: "mwstas", en: "a moustache", type: "noun", g: "m", note: "pl. mwstashis" },
  { cy: "mwy neu lai", en: "more or less", type: "idiom" },
  { cy: "mwyn", en: "mild", type: "word" },
  { cy: "myfyriwr", en: "a male student", type: "noun", g: "m", note: "pl. myfyrwyr" },
  { cy: "myfyrwraig", en: "a female student", type: "noun", g: "f", note: "pl. myfyrwragedd" },
  { cy: "mynd ati", en: "to go about (doing something", type: "verb", note: "+ i wneud rhywbeth" },
  { cy: "mynedfa", en: "an entrance", type: "noun", g: "f", note: "pl. mynedfeydd" },
  { cy: "mynydd", en: "a mountain", type: "noun", g: "m", note: "pl. mynyddoedd" },
  { cy: "nadredd", en: "snakes (gw. neidr", type: "word" },
  { cy: "naid", en: "a jump, a leap", type: "noun", g: "f", note: "pl. neidiau" },
  { cy: "natur", en: "nature", type: "noun", g: "f" },
  { cy: "naturiol", en: "natural", type: "word" },
  { cy: "neges", en: "a message", type: "noun", g: "f", note: "pl. negeseuon" },
  { cy: "neidio", en: "to jump", type: "verb", note: "bôn: neidi-" },
  { cy: "neidr", en: "a snake", type: "noun", g: "f", note: "pl. nadroedd, hefyd, nadredd" },
  { cy: "newid", en: "to change", type: "verb", note: "bôn: newidi-" },
  { cy: "newyddiadurwr", en: "a journalist", type: "noun", g: "m", note: "pl. newyddiadurwyr" },
  { cy: "nifer", en: "a number", type: "noun", g: "m" },
  { cy: "niwl", en: "fog, mist", type: "noun", g: "m", note: "pl. niwloedd" },
  { cy: "nodyn", en: "a note", type: "noun", g: "m", note: "pl. nodiadau, nodau" },
  { cy: "noddi", en: "to sponsor", type: "verb", note: "bôn: nodd-" },
  { cy: "nofel", en: "a novel", type: "noun", g: "f", note: "pl. nofelau" },
  { cy: "Norman", en: "a Norman", type: "noun", g: "m", note: "pl. Normaniaid" },
  { cy: "Noswyl Nadolig", en: "Christmas Eve", type: "noun", g: "f" },
  { cy: "nwyddau", en: "goods, merchandise", type: "word" },
  { cy: "o dro i dro", en: "from time to time", type: "idiom" },
  { cy: "o hyd", en: "still, yet", type: "idiom" },
  { cy: "oddi wrth", en: "from (a person", type: "idiom" },
  { cy: "oedolyn", en: "an adult", type: "noun", g: "m", note: "pl. oedolion" },
  { cy: "oen", en: "a lamb", type: "noun", g: "m", note: "pl. ŵyn" },
  { cy: "oergell", en: "a refrigerator", type: "noun", g: "f", note: "pl. oergelloedd" },
  { cy: "oes", en: "an age (time)", type: "noun", g: "f", note: "pl. oesoedd" },
  { cy: "ofn", en: "fear", type: "noun", g: "m", note: "pl. ofnau" },
  { cy: "olew", en: "oil", type: "noun", g: "m", note: "pl. olewau" },
  { cy: "olwyn", en: "a wheel", type: "noun", g: "f", note: "pl. olwynion" },
  { cy: "opsiwn", en: "an option", type: "noun", g: "m", note: "pl. opsiynau" },
  { cy: "optegydd", en: "an optician", type: "noun", g: "m", note: "pl. optegwyr" },
  { cy: "o’r blaen", en: "before, previously", type: "idiom" },
  { cy: "o’r diwedd", en: "at last, finally", type: "idiom" },
  { cy: "palu", en: "to dig", type: "verb", note: "bôn: pal-" },
  { cy: "pam lai?", en: "why not?", type: "idiom" },
  { cy: "panel", en: "a panel", type: "noun", g: "m", note: "pl. paneli" },
  { cy: "papur", en: "a paper, a newspaper", type: "noun", g: "m", note: "pl. papurau" },
  { cy: "papur bro", en: "a community newspaper", type: "noun", g: "m" },
  { cy: "papuro", en: "to paper (decorating)", type: "verb", note: "bôn: papur-" },
  { cy: "parsel", en: "a parcel", type: "noun", g: "m", note: "pl. parseli" },
  { cy: "pasio", en: "to pass", type: "verb", note: "bôn: pasi-" },
  { cy: "peiriannydd", en: "an engineer", type: "noun", g: "m", note: "pl. peirianwyr" },
  { cy: "pêl-fasged", en: "basketball", type: "noun", g: "f" },
  { cy: "pêl-rwyd", en: "netball", type: "noun", g: "f" },
  { cy: "pen ôl", en: "bottom (body part)", type: "noun", g: "m", note: "pl. penolau" },
  { cy: "pen-blwydd priodas", en: "a wedding anniversary", type: "noun", g: "m" },
  { cy: "penderfynu", en: "to decide", type: "verb", note: "bôn: penderfyn-" },
  { cy: "penelin", en: "an elbow", type: "noun", g: "m", note: "pl. penelinoedd" },
  { cy: "pen-glin", en: "a knee", type: "noun", g: "m", note: "pl. pengliniau" },
  { cy: "pennill", en: "a verse", type: "noun", g: "m", note: "pl. penillion" },
  { cy: "Penrhyn Gŵyr", en: "the Gower Peninsula", type: "noun", g: "m" },
  { cy: "perlysieuyn", en: "a herb", type: "noun", g: "m", note: "pl. perlysiau" },
  { cy: "personol", en: "personal", type: "word" },
  { cy: "peryglus", en: "dangerous", type: "word" },
  { cy: "pilio", en: "to peel", type: "verb", note: "bôn: pili-" },
  { cy: "plaen", en: "plain (ans.", type: "word" },
  { cy: "plât", en: "a plate", type: "noun", g: "m", note: "pl. platiau" },
  { cy: "plicio", en: "to peel", type: "verb", note: "bôn: plici-" },
  { cy: "pluen", en: "a feather", type: "noun", g: "f", note: "pl. plu" },
  { cy: "plwg", en: "a plug", type: "noun", g: "m", note: "pl. plygiau" },
  { cy: "plymwr", en: "a plumber", type: "noun", g: "m", note: "pl. plymwyr" },
  { cy: "pobi", en: "to bake", type: "verb", note: "bôn: pob-" },
  { cy: "poblogaidd", en: "popular", type: "word" },
  { cy: "poced", en: "a pocket", type: "noun", g: "f", note: "pl. pocedi" },
  { cy: "poenus", en: "painful", type: "word" },
  { cy: "poeth", en: "hot", type: "word" },
  { cy: "popty", en: "an oven", type: "noun", g: "m", note: "pl. poptai" },
  { cy: "porthladd", en: "a port, a harbour", type: "noun", g: "m", note: "pl. porthladdoedd" },
  { cy: "postio", en: "to post", type: "verb", note: "bôn: posti-" },
  { cy: "potel", en: "a bottle", type: "noun", g: "f", note: "pl. poteli" },
  { cy: "powdr", en: "powder", type: "noun", g: "m" },
  { cy: "powlen", en: "a bowl", type: "noun", g: "f", note: "pl. powlenni" },
  { cy: "pren", en: "wooden", type: "word" },
  { cy: "presennol", en: "(the) present", type: "noun", g: "m" },
  { cy: "preswyl", en: "residential", type: "word" },
  { cy: "prifddinas", en: "capital city", type: "noun", g: "f", note: "pl. prifddinasoedd" },
  { cy: "priodas", en: "a wedding", type: "noun", g: "f", note: "pl. priodasau" },
  { cy: "pris", en: "a price", type: "noun", g: "m", note: "pl. prisiau" },
  { cy: "pry copyn", en: "a spider", type: "noun", g: "m", note: "pl. pryfaid cop" },
  { cy: "Prydain", en: "Britain", type: "noun", g: "f" },
  { cy: "prydferth", en: "beautiful", type: "word" },
  { cy: "pupur", en: "pepper", type: "noun", g: "m" },
  { cy: "pwdin", en: "a pudding", type: "noun", g: "m", note: "pl. pwdinau" },
  { cy: "pwnc", en: "a subject", type: "noun", g: "m", note: "pl. pynciau" },
  { cy: "pwrs", en: "a purse", type: "noun", g: "m", note: "pl. pyrsiau" },
  { cy: "pwynt", en: "a point", type: "noun", g: "m", note: "pl. pwyntiau" },
  { cy: "pwys", en: "pound (dim arian)", type: "noun", g: "m", note: "pl. pwysi/pwysau" },
  { cy: "pwysau", en: "weight, weights", type: "noun", g: "m" },
  { cy: "pysgota", en: "to fish", type: "verb", note: "bôn: pysgot-" },
  { cy: "pythefnos", en: "a fortnight", type: "noun", g: "m" },
  { cy: "realiti", en: "reality", type: "noun", g: "f" },
  { cy: "reidio", en: "to ride", type: "verb", note: "bôn: reidi-" },
  { cy: "reis", en: "rice", type: "noun", g: "m" },
  { cy: "rysáit", en: "a recipe", type: "noun", g: "f", note: "pl. ryseitiau" },
  { cy: "rhaeadr", en: "a waterfall", type: "noun", g: "m", note: "pl. rhaeadrau" },
  { cy: "rhag ofn", en: "(just) in case", type: "idiom" },
  { cy: "rhan fwya", en: "a majority", type: "noun", g: "f" },
  { cy: "rhannu", en: "to share, to divide", type: "verb", note: "bôn: rhann-" },
  { cy: "rhegi", en: "to swear, to curse", type: "verb", note: "bôn: rheg-" },
  { cy: "rheilffordd", en: "a railway", type: "noun", g: "f", note: "pl. rheilffyrdd" },
  { cy: "rhentio", en: "to rent (bôn: rhenti-) (Gogledd Cymru", type: "verb" },
  { cy: "rhentu", en: "to rent (bôn: rhent-) (De Cymru", type: "verb" },
  { cy: "rheswm", en: "a reason", type: "noun", g: "m", note: "pl. rhesymau" },
  { cy: "rhesymol", en: "reasonable", type: "word" },
  { cy: "rhewgell", en: "a freezer", type: "noun", g: "f", note: "pl. rhewgelloedd" },
  { cy: "rhewi", en: "to freeze", type: "verb", note: "bôn: rhew-" },
  { cy: "rhiant", en: "a parent", type: "noun", g: "m", note: "pl. rhieni" },
  { cy: "rhiwbob", en: "rhubarb", type: "noun", g: "m" },
  { cy: "rhoi gwybod", en: "to inform", type: "verb", note: "+ i" },
  { cy: "rhugl", en: "fluent", type: "word" },
  { cy: "rhydd", en: "free, loose, available", type: "word" },
  { cy: "rhyngwladol", en: "international", type: "word" },
  { cy: "rhyw fath", en: "some sort", type: "idiom" },
  { cy: "rhywbryd", en: "sometime", type: "word" },
  { cy: "safle bws", en: "a bus stop", type: "noun", g: "m", note: "pl. safleoedd bws" },
  { cy: "salwch", en: "illness, sickness", type: "noun", g: "m" },
  { cy: "sandal", en: "a sandal", type: "noun", g: "f", note: "pl. sandalau" },
  { cy: "sawdl", en: "a heel", type: "noun", g: "m", note: "pl. sodlau" },
  { cy: "sawl", en: "several, many", type: "word" },
  { cy: "Sbaeneg", en: "Spanish (language", type: "noun", g: "f" },
  { cy: "sbectol", en: "spectacles, glasses", type: "noun", g: "f", note: "pl. sbectolau" },
  { cy: "sbectol haul", en: "sunglasses", type: "noun", g: "f", note: "pl. sbectolau haul" },
  { cy: "sbeislyd", en: "spicy", type: "word" },
  { cy: "sboncen", en: "squash (chwaraeon", type: "noun", g: "f" },
  { cy: "sebon", en: "soap", type: "noun", g: "m" },
  { cy: "sedd", en: "a seat", type: "noun", g: "f", note: "pl. seddi" },
  { cy: "sef", en: "i.e. (that is to say", type: "idiom" },
  { cy: "seler", en: "a cellar", type: "noun", g: "f", note: "pl. seleri" },
  { cy: "selsigen", en: "a sausage", type: "noun", g: "f", note: "pl. selsig" },
  { cy: "senedd", en: "a parliament, a senate", type: "noun", g: "f", note: "pl. seneddau" },
  { cy: "seremoni", en: "a ceremony", type: "noun", g: "f", note: "pl. seremonïau" },
  { cy: "sgarff", en: "a scarf", type: "noun", g: "f", note: "pl. sgarffiau" },
  { cy: "sgert", en: "a skirt", type: "noun", g: "f", note: "pl. sgertiau" },
  { cy: "sgrin", en: "a screen", type: "noun", g: "f", note: "pl. sgriniau" },
  { cy: "sgwrs", en: "a conversation, a chat", type: "noun", g: "f", note: "pl. sgyrsiau" },
  { cy: "sgwrsio", en: "to converse, to chat", type: "verb", note: "bôn: sgyrsi-" },
  { cy: "siaced", en: "a jacket", type: "noun", g: "f", note: "pl. siacedi" },
  { cy: "sianel", en: "a channel", type: "noun", g: "f", note: "pl. sianeli" },
  { cy: "sied", en: "a shed", type: "noun", g: "f", note: "pl. siediau" },
  { cy: "sinc", en: "a sink", type: "noun", g: "f", note: "pl. sinciau" },
  { cy: "siomedig", en: "disappointing, disappointed", type: "word" },
  { cy: "siwmper", en: "a sweater, a jumper", type: "noun", g: "f", note: "pl. siwmperi, siwtiau" },
  { cy: "sliper", en: "a slipper", type: "noun", g: "f", note: "pl. sliperi" },
  { cy: "sôn", en: "to mention", type: "verb", note: "bôn: soni-; + am" },
  { cy: "sosban", en: "a saucepan", type: "noun", g: "f", note: "pl. sosbenni" },
  { cy: "soser", en: "a saucer", type: "noun", g: "f", note: "pl. soseri" },
  { cy: "stadiwm", en: "a stadium", type: "noun", g: "m", note: "pl. stadiymau" },
  { cy: "stori", en: "a story", type: "noun", g: "f", note: "pl. storïau" },
  { cy: "storm", en: "a storm", type: "noun", g: "f", note: "pl. stormydd" },
  { cy: "straen", en: "a strain, a stress, tension", type: "noun", g: "f", note: "pl. straeniau" },
  { cy: "stumog", en: "a stomach", type: "noun", g: "f", note: "pl. stumogau" },
  { cy: "suddo", en: "to sink", type: "verb", note: "bôn: sudd-" },
  { cy: "swil", en: "shy, bashful", type: "word" },
  { cy: "Swistir, y", en: "Switzerland", type: "noun", g: "f" },
  { cy: "sŵn", en: "a sound, a noise", type: "noun", g: "m", note: "pl. synau" },
  { cy: "swyddog", en: "an officer", type: "noun", g: "m", note: "pl. swyddogion" },
  { cy: "sychu", en: "to dry", type: "verb", note: "bôn: sych-" },
  { cy: "sychwr gwallt", en: "a hairdryer", type: "noun", g: "m" },
  { cy: "sylwi", en: "to notice (something)", type: "verb", note: "bôn: sylw-; + ar" },
  { cy: "syml", en: "simple", type: "word" },
  { cy: "ta beth", en: "anyway (De Cymru", type: "idiom" },
  { cy: "tacluso", en: "to tidy", type: "verb", note: "bôn: taclus-" },
  { cy: "tacsi", en: "a taxi", type: "noun", g: "m", note: "pl. tacsis" },
  { cy: "tafarnwr", en: "an innkeeper", type: "noun", g: "m", note: "pl. tafarnwyr" },
  { cy: "taflu", en: "to throw", type: "verb", note: "bôn: tafl-" },
  { cy: "tafod", en: "a tongue", type: "noun", g: "m", note: "pl. tafodau" },
  { cy: "tair gwaith", en: "three times", type: "idiom" },
  { cy: "tal", en: "tall", type: "word" },
  { cy: "taldra", en: "height, stature, tallness", type: "noun", g: "m" },
  { cy: "tap", en: "a tap", type: "noun", g: "m", note: "pl. tapiau" },
  { cy: "tawel", en: "quiet, calm", type: "word" },
  { cy: "tebot", en: "a teapot", type: "noun", g: "m", note: "pl. tebotau" },
  { cy: "technegydd", en: "a technician", type: "noun", g: "m", note: "pl. technegwyr" },
  { cy: "technoleg", en: "technology", type: "noun", g: "f" },
  { cy: "teigr", en: "a tiger", type: "noun", g: "m", note: "pl. teigrod" },
  { cy: "teipio", en: "to type", type: "verb", note: "bôn: teipi-" },
  { cy: "teithiwr", en: "a traveller", type: "noun", g: "m", note: "pl. teithwyr" },
  { cy: "telyn", en: "a harp", type: "noun", g: "f", note: "pl. telynau" },
  { cy: "tenau", en: "thin", type: "word" },
  { cy: "tew", en: "fat (ans.", type: "word" },
  { cy: "tisian", en: "to sneeze", type: "verb", note: "bôn: tisi-" },
  { cy: "tlawd", en: "poor, poverty-stricken", type: "word" },
  { cy: "ton", en: "a wave", type: "noun", g: "f", note: "pl. tonnau" },
  { cy: "torheulo", en: "to sunbathe", type: "verb", note: "bôn: torheul-" },
  { cy: "tra", en: "while, whilst", type: "word" },
  { cy: "tractor", en: "a tractor", type: "noun", g: "m", note: "pl. tractorau" },
  { cy: "traddodiadol", en: "traditional", type: "word" },
  { cy: "trafferth", en: "trouble, bother", type: "noun", g: "f", note: "pl. trafferthion" },
  { cy: "traffordd", en: "a motorway", type: "noun", g: "f", note: "pl. traffyrdd" },
  { cy: "trais", en: "violence", type: "noun", g: "m" },
  { cy: "tramor", en: "overseas, abroad", type: "word" },
  { cy: "trawiadol", en: "striking (ans.", type: "word" },
  { cy: "trefnus", en: "organised, orderly", type: "word" },
  { cy: "treth", en: "a tax", type: "noun", g: "f", note: "pl. trethi" },
  { cy: "treulio", en: "to spend (time)", type: "verb", note: "bôn: treuli-" },
  { cy: "triongl", en: "a triangle", type: "noun", g: "m", note: "pl. trionglau" },
  { cy: "troedfedd", en: "a foot (measurement)", type: "noun", g: "f", note: "pl. troedfeddi" },
  { cy: "trôns", en: "underpants", type: "noun", g: "m" },
  { cy: "trowsus", en: "trousers", type: "noun", g: "m" },
  { cy: "trwm", en: "heavy", type: "word" },
  { cy: "trwsio", en: "to repair, to mend", type: "verb", note: "bôn: trwsi-" },
  { cy: "trydanwr", en: "an electrician", type: "noun", g: "m", note: "pl. trydanwyr" },
  { cy: "trydar", en: "to tweet, to twitter", type: "verb", note: "bôn: trydar-" },
  { cy: "tu ôl", en: "behind", type: "idiom", note: "+ i" },
  { cy: "tun", en: "a tin, a can", type: "noun", g: "m", note: "pl. tuniau" },
  { cy: "twll", en: "a hole", type: "noun", g: "m", note: "pl. tyllau" },
  { cy: "twmpath dawns", en: "a barn dance", type: "noun", g: "m", note: "pl. twmpathau dawns" },
  { cy: "twnnel", en: "a tunnel", type: "noun", g: "m", note: "pl. twnelau" },
  { cy: "twpsyn", en: "a silly person, a stupid person", type: "noun", g: "m", note: "pl. twpsod" },
  { cy: "tŵr", en: "a tower", type: "noun", g: "m", note: "pl. tyrau" },
  { cy: "twrci", en: "a turkey", type: "noun", g: "m", note: "pl. twrcïod" },
  { cy: "twristiaeth", en: "tourism", type: "noun", g: "f" },
  { cy: "tŷ ar wahân", en: "detached house; tai ar wahân – detached houses", type: "idiom" },
  { cy: "tŷ gwydr", en: "a greenhouse", type: "noun", g: "m", note: "pl. tai gwydr" },
  { cy: "tŷ pâr", en: "semi-detached house", type: "idiom", note: "pl. tai pâr" },
  { cy: "tŷ teras", en: "a terraced house", type: "noun", g: "m", note: "pl. tai teras" },
  { cy: "tybed?", en: "I wonder?", type: "word" },
  { cy: "tywel", en: "a towel", type: "noun", g: "m", note: "pl. tywelion" },
  { cy: "tywod", en: "sand", type: "noun", g: "m" },
  { cy: "tywyll", en: "dark", type: "word" },
  { cy: "theatr", en: "a theatre", type: "noun", g: "f", note: "pl. theatrau" },
  { cy: "uchel", en: "high", type: "word" },
  { cy: "unig", en: "lonely, only", type: "word" },
  { cy: "union", en: "exact, direct (gw. yn union", type: "word" },
  { cy: "wedi’r cyfan", en: "after all", type: "idiom" },
  { cy: "wrth fy modd", en: "in my element", type: "idiom" },
  { cy: "wrth ochr", en: "by the side of", type: "idiom" },
  { cy: "ŵyr", en: "grandson", type: "noun", g: "m", note: "pl. wyrion" },
  { cy: "wyres", en: "granddaughter", type: "noun", g: "f", note: "pl. wyresau" },
  { cy: "ychwanegol", en: "additional", type: "word" },
  { cy: "ychwanegu", en: "to add (to)", type: "verb", note: "bôn: ychwaneg-; + at" },
  { cy: "y dyddiau hyn", en: "these days", type: "idiom" },
  { cy: "y lleill", en: "the others", type: "idiom" },
  { cy: "ymarfer corff", en: "physical education", type: "noun", g: "m" },
  { cy: "ymbarél", en: "umbrella", type: "noun", g: "m", note: "pl. ymbarelau" },
  { cy: "ymddiheuro", en: "to apologise", type: "verb", note: "bôn: ymddiheur-" },
  { cy: "ymuno", en: "to join", type: "verb", note: "bôn: ymun-; + â" },
  { cy: "ymweld", en: "to visit", type: "verb", note: "bôn: ymwel-" },
  { cy: "ymwelydd", en: "visitor", type: "noun", g: "m", note: "pl. ymwelwyr" },
  { cy: "ymyl", en: "an edge, rim", type: "noun", g: "m", note: "pl. ymylon" },
  { cy: "yn lle", en: "instead of, in place of", type: "idiom" },
  { cy: "yn union", en: "exactly, directly", type: "idiom" },
  { cy: "yn y bôn", en: "basically", type: "idiom" },
  { cy: "yn ymyl", en: "near, beside", type: "idiom" },
  { cy: "yn ystod", en: "during", type: "idiom" },
  { cy: "yn y pen draw", en: "eventually", type: "idiom" },
  { cy: "Yr Eidal", en: "Italy", type: "noun", g: "f" },
  { cy: "y rhan fwya", en: "the majority", type: "idiom" },
  { cy: "ysgafn", en: "light (of weight) (ans.", type: "word" },
  { cy: "ysgariad", en: "a divorce", type: "noun", g: "m", note: "pl. ysgariadau" },
  { cy: "ysgol fabanod", en: "an infant school", type: "noun", g: "f", note: "pl. ysgolion babanod" },
  { cy: "ysgol gyfun", en: "a comprehensive school", type: "noun", g: "f", note: "pl. ysgolion cyfun" },
  { cy: "ysgol gynradd", en: "a primary school", type: "noun", g: "f", note: "pl. ysgolion cynradd" },
  { cy: "ysgol uwchradd", en: "a secondary school", type: "noun", g: "f", note: "pl. ysgolion uwchradd" },
  { cy: "ysgwydd", en: "a shoulder", type: "noun", g: "f", note: "pl. ysgwyddau" },
  { cy: "ysmygu", en: "to smoke", type: "verb", note: "bôn: ysmyg-" },
  { cy: "ystafell", en: "a room; ystafelloedd rooms", type: "noun", g: "f" },
  { cy: "ystafell wydr", en: "a conservatory", type: "noun", g: "f", note: "pl. ystafelloedd gwydr" },
  { cy: "ystod", en: "range (gw. yn ystod", type: "noun", g: "f" },
  { cy: "yswiriant", en: "insurance", type: "noun", g: "m" },
  { cy: "Y Swistir", en: "Switzerland", type: "noun", g: "f" },
  { cy: "ar ben", en: "on top of", type: "idiom" },
  { cy: "cof", en: "memory", type: "noun" },
  { cy: "math", en: "type, kind", type: "noun", note: "pl. mathau" },
  { cy: "sesiwn", en: "session", type: "noun", note: "pl. sesiynau" },
  { cy: "dotio", en: "to love", type: "verb", note: "+ ar" },
  { cy: "syrthio", en: "to fall", type: "verb" },
  { cy: "magu", en: "to bring up", type: "verb" },
  { cy: "beth bynnag", en: "anyway", type: "idiom" },
  { cy: "y llall", en: "the other(s)", type: "idiom", note: "pl. y lleill" },
  { cy: "rhaglen ddogfen", en: "documentary", type: "noun", note: "pl. rhaglenni dogfen" },
  { cy: "smocio", en: "to smoke", type: "verb", note: "also: ysmygu" },
  { cy: "santes", en: "a saint (female)", type: "noun", note: "pl. santesau" },
  { cy: "sant", en: "a saint", type: "noun", note: "pl. saint" },
  { cy: "locsyn", en: "beard", type: "noun", note: "pl. locsys" },
  { cy: "erthygl", en: "article", type: "noun", note: "pl. erthyglau" },
  { cy: "oren", en: "orange", type: "noun", note: "pl. orennau" },
  { cy: "darlith", en: "lecture", type: "noun", note: "pl. darlithoedd" },
  { cy: "goriad", en: "key", type: "noun", note: "pl. goriadau" },
  { cy: "dal y lein", en: "to hold the line", type: "idiom" },
  { cy: "dodrefn", en: "furniture", type: "noun" },
  { cy: "ar hyn o bryd", en: "at the moment", type: "idiom" },
  { cy: "uwchben", en: "above", type: "prep" },
  { cy: "wrth ymyl", en: "near", type: "idiom" },
  { cy: "cadwyn", en: "chain", type: "noun", note: "pl. cadwyni" },
  { cy: "clustdlws", en: "earring", type: "noun", note: "pl. clustdlysau" },
  { cy: "siwt", en: "suit", type: "noun", note: "pl. siwtiau" },
  { cy: "cartref henoed", en: "old people’s home", type: "idiom", note: "pl. cartrefi henoed" },
  { cy: "sws", en: "kiss", type: "noun", note: "pl. swsus" },
  { cy: "casáu", en: "to hate", type: "verb" },
  { cy: "brys", en: "pressing, urgent; emergency", type: "word" },
  { cy: "cyhoeddus", en: "public", type: "adj" },
  { cy: "Cymru am byth!", en: "Wales for ever!", type: "idiom" },
  { cy: "ar goll", en: "lost", type: "idiom" },
  { cy: "adre", en: "at home", type: "adv" },
  { cy: "ffwrdd â ni", en: "off we go", type: "idiom" },
  { cy: "hances", en: "handkerchief", type: "noun", note: "pl. hancesi" },
  { cy: "clwt", en: "nappy", type: "noun", note: "pl. clytiau" },
  { cy: "dewin", en: "wizard", type: "noun", note: "pl. dewiniaid" },
  { cy: "dysgwr", en: "learner", type: "noun", note: "pl. dysgwyr" },
  { cy: "cyn bo hir", en: "before long", type: "idiom" },
  { cy: "yn aml", en: "often", type: "idiom" },
];

// Formats the injected build timestamp (see vite.config.js) into a short,
// readable string for the version marker in the footer.
function formatBuildTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return iso;
  }
}

const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP = new Set([
  "a", "an", "the", "to", "of", "in", "on", "with", "for", "or", "and",
  "someone", "something", "s", "it", "its", "one", "be", "is",
]);

function significantTokens(s) {
  return norm(s)
    .split(" ")
    .filter((t) => t && !STOP.has(t));
}

// Levenshtein edit distance — how many single-character insertions,
// deletions, or substitutions separate two words.
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

// Tolerance scales with word length — short words get no leeway at all
// (too easy to accidentally match a different real word), longer words
// get a little more room for a genuine typo.
function fuzzyTolerance(len) {
  if (len <= 3) return 0;
  if (len <= 7) return 1;
  return 2;
}

function tokenMatches(typedTok, expectedTok, allowFuzzy) {
  if (typedTok === expectedTok) return true;
  if (!allowFuzzy) return false;
  const tol = fuzzyTolerance(expectedTok.length);
  if (tol === 0) return false;
  return levenshtein(typedTok, expectedTok) <= tol;
}

// allowFuzzy should only ever be true when the person is typing an ENGLISH
// answer. Welsh answers stay exact — a single letter (or a missing to bach)
// can be the entire difference between two unrelated Welsh words, or between
// a mutated and unmutated form, so fuzzy tolerance there could silently
// mask exactly the kind of mutation error this app exists to catch.
function isLikelyCorrect(typed, expected, allowFuzzy) {
  const t = norm(typed);
  if (!t) return false;

  // Split the gloss into its real alternative senses — "sheltered, shady /
  // (political) shadow" means THREE separate acceptable answers, not one
  // combined phrase you need to reproduce in full.
  const withoutParens = expected.replace(/\([^)]*\)/g, " ");
  const alternatives = withoutParens
    .split(/[,/;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const candidates = alternatives.length ? alternatives : [expected];

  const tTokens = significantTokens(typed);

  return candidates.some((alt) => {
    const e = norm(alt);
    if (!e) return false;
    if (t === e) return true;
    const eTok = significantTokens(alt);
    if (eTok.length === 0) return false;
    const hits = eTok.filter((etok) =>
      tTokens.some((ttok) => tokenMatches(ttok, etok, allowFuzzy))
    ).length;
    return hits / eTok.length >= 0.5;
  });
}

const STATUS = { NEW: "new", STRUGGLING: "struggling", MASTERED: "mastered" };
const WEIGHT = { new: 3, struggling: 6, mastered: 1 };

function pickWeighted(items, progress, avoidId) {
  const pool = items.filter((w) => w.id !== avoidId || items.length === 1);
  const weights = pool.map((w) => WEIGHT[progress[w.id] || STATUS.NEW]);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

const STORAGE_KEY = "geirfa-sylfaen-progress-v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export default function App() {
  const items = useMemo(
    () =>
      WORDS.map((w) => ({
        ...w,
        id: norm(w.cy).replace(/\s+/g, "-"),
      })),
    []
  );

  const [progress, setProgress] = useState(loadProgress);
  const [current, setCurrent] = useState(null);
  const [mode, setMode] = useState("flashcard"); // 'flashcard' | 'type'
  const [direction, setDirection] = useState("cy-en"); // 'cy-en' | 'en-cy'
  const [flipped, setFlipped] = useState(false);
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState(null); // null | 'correct' | 'incorrect'
  const [sessionSeen, setSessionSeen] = useState(0);

  // Welsh pronunciation, via Bangor University's free Techiaith TTS API
  // (api.techiaith.cymru/speak/v3) — a genuine Welsh voice, not a browser
  // system voice (no such thing is currently available on most devices).
  // We use their Piper model in Welsh-only mode ("cy") with a Gogledd
  // speaker, since it's the fastest/most predictable engine for short,
  // isolated words, and Welsh-only mode avoids any risk of a short word
  // being mis-detected as English by the bilingual model.
  const [speaking, setSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const audioRef = useRef(null);

  const speakWelsh = useCallback((text) => {
    setSpeechError(null);
    setSpeaking(true);
    const url =
      "https://api.techiaith.cymru/speak/v3/api/piper?text=" +
      encodeURIComponent(text) +
      "&speaker_id=gwryw-gogledd-pro&model=cy";

    // <audio src> rather than fetch() — fetch() to this domain gets
    // blocked outright ("Failed to fetch", a CORS wall), but <audio>
    // tag loading doesn't need CORS just to play, so it has a real
    // chance of working once Bangor's own service is back up. We lose
    // the ability to read the exact HTTP status this way, so the
    // message stays generic — but it's honest, and short.
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => {
      setSpeaking(false);
      setSpeechError("Methu clywed y gair — gwasanaeth i lawr, neu broblem gysylltu");
    };
    audio.play().catch((err) => {
      setSpeaking(false);
      setSpeechError("Methu chwarae (" + (err.name || "gwall") + ")");
    });
  }, []);

  const [attempted, setAttempted] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const inputRef = useRef(null);

  // Pick the first word on mount (localStorage is synchronous, so
  // progress is already available — no async loading gate needed).
  useEffect(() => {
    if (!current) {
      setCurrent(pickWeighted(items, progress, null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProgress = useCallback((next) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Couldn't save progress", e);
    }
  }, []);

  const setStatus = (id, status) => {
    const next = { ...progress, [id]: status };
    saveProgress(next);
  };

  const nextWord = useCallback(() => {
    setCurrent((prev) => pickWeighted(items, progress, prev ? prev.id : null));
    setFlipped(false);
    setTyped("");
    setVerdict(null);
    setSessionSeen((n) => n + 1);
    setSpeechError(null);
    setSpeaking(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, [items, progress]);

  // Let Return/Enter activate "Nesaf" whenever the answer is already showing —
  // refs avoid stale-closure issues in a window-level listener.
  const modeRef = useRef(mode);
  const flippedRef = useRef(flipped);
  const verdictRef = useRef(verdict);
  const lastCheckAtRef = useRef(0);
  useEffect(() => {
    modeRef.current = mode;
    flippedRef.current = flipped;
    verdictRef.current = verdict;
  }, [mode, flipped, verdict]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== "Enter" || e.repeat) return;
      // Small cooldown after a check just fired, so an OS/browser key-repeat
      // (or a fast double-press) can't immediately fire "next" before you've
      // had a chance to actually see the result.
      if (Date.now() - lastCheckAtRef.current < 350) return;
      const answerShown =
        modeRef.current === "flashcard" ? flippedRef.current : verdictRef.current !== null;
      if (answerShown) {
        e.preventDefault();
        nextWord();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextWord]);

  const counts = useMemo(() => {
    const c = { new: 0, struggling: 0, mastered: 0 };
    items.forEach((w) => {
      const s = progress[w.id] || STATUS.NEW;
      c[s] += 1;
    });
    return c;
  }, [items, progress]);

  const resetAll = () => {
    saveProgress({});
  };

  if (!current) {
    return (
      <Shell>
        <div className="loading-wrap">
          <Loader2 className="spin" size={28} />
          <p className="mono small muted">Yn llwytho'r geirfa…</p>
        </div>
      </Shell>
    );
  }

  const prompt = direction === "cy-en" ? current.cy : current.en;
  const answer = direction === "cy-en" ? current.en : current.cy;
  const promptIsWelsh = direction === "cy-en";
  const wordColor =
    current.g === "m" ? "#7FB0E0" : current.g === "f" ? "#E896B8" : undefined;
  const status = progress[current.id] || STATUS.NEW;

  const showAnswer = mode === "flashcard" ? flipped : verdict !== null;

  const handleCheck = () => {
    const ok = isLikelyCorrect(typed, answer, promptIsWelsh);
    setVerdict(ok ? "correct" : "incorrect");
    setAttempted((n) => n + 1);
    if (ok) setCorrectCount((n) => n + 1);
    lastCheckAtRef.current = Date.now();
  };

  const handleOverride = () => {
    setVerdict((v) => {
      const flipped = v === "correct" ? "incorrect" : "correct";
      setCorrectCount((n) => (flipped === "correct" ? n + 1 : Math.max(0, n - 1)));
      return flipped;
    });
  };

  const handleFlip = () => setFlipped((f) => !f);

  const cardStatusClass =
    status === "struggling" ? "card-struggling" : status === "mastered" ? "card-mastered" : "card-new";

  return (
    <Shell>
      {/* Header controls */}
      <div className="row-between wrap gap-3 mb-6">
        <div className="row gap-3 mono xs muted">
          <StatPill label="Heb farcio" value={counts.new} dotClass="dot-slateblue" />
          <StatPill label="Yn anodd" value={counts.struggling} dotClass="dot-gorse" />
          <StatPill label="Meistrolwyd" value={counts.mastered} dotClass="dot-moss" />
        </div>
        <button onClick={resetAll} className="ghost-btn mono xs">
          <RotateCcw size={13} />
          Ailosod cynnydd
        </button>
      </div>

      {attempted > 0 && (
        <div className="accuracy-row mono xs muted mb-6">
          Cywirdeb y sesiwn:{" "}
          <span className="accuracy-value">
            {Math.round((correctCount / attempted) * 100)}%
          </span>{" "}
          ({correctCount}/{attempted})
        </div>
      )}

      {/* Mode / direction toggles */}
      <div className="row wrap gap-2 mb-6">
        <ToggleGroup>
          <ToggleButton
            active={mode === "flashcard"}
            onClick={() => {
              setMode("flashcard");
              setVerdict(null);
              setTyped("");
              setSpeechError(null);
            }}
          >
            <Layers size={14} /> Fflachgardiau
          </ToggleButton>
          <ToggleButton
            active={mode === "type"}
            onClick={() => {
              setMode("type");
              setFlipped(false);
              setSpeechError(null);
            }}
          >
            <Keyboard size={14} /> Teipio
          </ToggleButton>
        </ToggleGroup>

        <button
          onClick={() => {
            setDirection((d) => (d === "cy-en" ? "en-cy" : "cy-en"));
            setFlipped(false);
            setTyped("");
            setVerdict(null);
            setSpeechError(null);
          }}
          className="pill-btn mono xs"
        >
          <ArrowLeftRight size={13} />
          {direction === "cy-en" ? "Cymraeg → Saesneg" : "Saesneg → Cymraeg"}
        </button>
      </div>

      {/* The card */}
      <div className={`slate-card ${cardStatusClass}`}>
        <div className="row-between mb-6">
          <div className="row gap-2">
            <span className="mono xxs uppercase muted spaced">{current.type || ""}</span>
            {current.g && <GenderBadge g={current.g} />}
          </div>
          {status !== STATUS.NEW && (
            <span
              className={`mono xxs uppercase spaced ${status === "struggling" ? "text-gorse" : "text-moss"}`}
            >
              {status === "struggling" ? "Yn anodd" : "Meistrolwyd"}
            </span>
          )}
        </div>

        <div className="prompt-area">
          <div className="word-row">
            <p
              className="chalk-display prompt-text"
              style={promptIsWelsh && wordColor ? { color: wordColor } : undefined}
            >
              {prompt}
            </p>
            {promptIsWelsh && (
              <button
                onClick={() => speakWelsh(current.cy)}
                disabled={speaking}
                className={`speak-btn ${speechError ? "speak-btn-error" : ""}`}
                title={speechError ? speechError + " (cliciwch eto)" : "Gwrando"}
              >
                {speaking ? (
                  <Loader2 size={20} className="spin" />
                ) : speechError ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
            )}
          </div>

          {showAnswer && (
            <div className="answer-area">
              <div className="word-row">
                <p
                  className="answer-text"
                  style={!promptIsWelsh && wordColor ? { color: wordColor } : undefined}
                >
                  {answer}
                </p>
                {!promptIsWelsh && (
                  <button
                    onClick={() => speakWelsh(current.cy)}
                    disabled={speaking}
                    className={`speak-btn ${speechError ? "speak-btn-error" : ""}`}
                    title={speechError ? speechError + " (cliciwch eto)" : "Gwrando"}
                  >
                    {speaking ? (
                      <Loader2 size={18} className="spin" />
                    ) : speechError ? (
                      <VolumeX size={18} />
                    ) : (
                      <Volume2 size={18} />
                    )}
                  </button>
                )}
              </div>
              {current.note && <p className="note-text">{current.note}</p>}
            </div>
          )}
        </div>

        {/* Interaction area */}
        {mode === "flashcard" ? (
          !flipped && (
            <button onClick={handleFlip} className="reveal-btn mono small">
              Dangos yr ateb
            </button>
          )
        ) : (
          verdict === null && (
            <div className="type-row">
              <input
                ref={inputRef}
                autoFocus
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCheck();
                  }
                }}
                placeholder="Teipiwch eich ateb…"
                className="type-input"
              />
              <button type="button" onClick={handleCheck} className="check-btn">
                Gwirio
              </button>
            </div>
          )
        )}

        {mode === "type" && verdict !== null && (
          <div className={`verdict-row mono small ${verdict === "correct" ? "text-moss" : "text-gorse"}`}>
            {verdict === "correct" ? <Check size={16} /> : <Flame size={16} />}
            {verdict === "correct" ? "Da iawn — cywir!" : "Ddim cweit — dyma'r ateb cywir."}
            <button onClick={handleOverride} className="link-btn muted">
              newid barn
            </button>
          </div>
        )}
      </div>

      {/* Flag + next controls, once answer is visible */}
      {showAnswer && (
        <div className="row wrap gap-2 controls-row">
          <FlagButton
            active={status === "struggling"}
            variant="gorse"
            onClick={() => setStatus(current.id, STATUS.STRUGGLING)}
          >
            <Flame size={14} /> Yn anodd
          </FlagButton>
          <FlagButton
            active={status === "mastered"}
            variant="moss"
            onClick={() => setStatus(current.id, STATUS.MASTERED)}
          >
            <Check size={14} /> Meistrolwyd
          </FlagButton>

          <button onClick={nextWord} className="next-btn">
            Nesaf
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      <p className="footer-text mono xxs muted">
        {items.length} gair yn y gronfa · {sessionSeen} wedi'u gweld y sesiwn yma
      </p>
      <p className="footer-text mono xxs muted version-marker">
        Adeiladwyd {formatBuildTime(__BUILD_TIME__)} · {__COMMIT_SHA__}
      </p>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="geirfa-outer">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .geirfa-outer {
          min-height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px 16px;
          background: #23262B;
          font-family: 'Work Sans', sans-serif;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .geirfa-outer *, .geirfa-outer *::before, .geirfa-outer *::after { box-sizing: border-box; }
        .geirfa-root { width: 100%; max-width: 560px; }

        .chalk-display { font-family: 'Big Shoulders Display', sans-serif; font-weight: 700; letter-spacing: 0.01em; color: #F1EDE4; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .small { font-size: 13px; }
        .xs { font-size: 12px; }
        .xxs { font-size: 11px; }
        .muted { color: #9BA3AD; }
        .uppercase { text-transform: uppercase; }
        .spaced { letter-spacing: 0.08em; }
        .text-gorse { color: #E3A33E; }
        .text-moss { color: #6FA287; }

        .gender-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 2px 7px;
          border-radius: 999px;
          border: 1px solid;
        }
        .gender-m { color: #7FB0E0; border-color: rgba(127,176,224,0.45); background: rgba(127,176,224,0.12); }
        .gender-f { color: #E896B8; border-color: rgba(232,150,184,0.45); background: rgba(232,150,184,0.12); }

        .row { display: flex; align-items: center; }
        .row-between { display: flex; align-items: center; justify-content: space-between; }
        .wrap { flex-wrap: wrap; }
        .gap-2 { gap: 8px; }
        .gap-3 { gap: 12px; }
        .mb-6 { margin-bottom: 22px; }

        .geirfa-header { margin-bottom: 22px; }
        .geirfa-header h1 { font-size: 26px; margin: 0; }
        .geirfa-header p { color: #9BA3AD; font-size: 14px; margin: 4px 0 0; }

        .dot { width: 6px; height: 6px; border-radius: 999px; display: inline-block; margin-right: 6px; }
        .dot-slateblue { background: #7C93A8; }
        .dot-gorse { background: #E3A33E; }
        .dot-moss { background: #6FA287; }
        .stat-pill { display: flex; align-items: center; }

        .accuracy-row { padding: 2px 0; }
        .accuracy-value { color: #F1EDE4; font-weight: 500; }

        .ghost-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: none; color: #9BA3AD;
          padding: 6px 8px; border-radius: 8px; cursor: pointer;
          transition: color 0.15s ease;
        }
        .ghost-btn:hover { color: #F1EDE4; }

        .pill-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          color: #9BA3AD; padding: 7px 14px; border-radius: 999px; cursor: pointer;
          transition: all 0.15s ease;
        }
        .pill-btn:hover { color: #F1EDE4; border-color: rgba(255,255,255,0.3); }

        .toggle-group {
          display: flex; border: 1px solid rgba(255,255,255,0.1); border-radius: 999px;
          padding: 3px; background: rgba(0,0,0,0.2);
        }
        .toggle-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: none; color: #9BA3AD;
          padding: 7px 14px; border-radius: 999px; cursor: pointer;
          font-family: 'IBM Plex Mono', monospace; font-size: 12px;
          transition: all 0.15s ease;
        }
        .toggle-btn.active { background: #F1EDE4; color: #171A1E; }
        .toggle-btn:not(.active):hover { color: #F1EDE4; }

        .slate-card {
          background: linear-gradient(155deg, #34383F 0%, #2C2F35 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 30px -12px rgba(0,0,0,0.55);
          border-radius: 18px;
          padding: clamp(22px, 5vw, 34px) clamp(18px, 4.5vw, 28px);
          margin-bottom: 18px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .card-struggling { border-color: rgba(227,163,62,0.55); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 3px rgba(227,163,62,0.12), 0 12px 30px -12px rgba(0,0,0,0.55); }
        .card-mastered { border-color: rgba(111,162,135,0.55); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 3px rgba(111,162,135,0.12), 0 12px 30px -12px rgba(0,0,0,0.55); }

        .prompt-area { min-height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .word-row { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .speak-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 999px; flex-shrink: 0;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: #F1EDE4; cursor: pointer; transition: all 0.15s ease;
        }
        .speak-btn:hover:not(:disabled) { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.3); }
        .speak-btn:disabled { color: #5B6169; cursor: not-allowed; opacity: 0.6; }
        .speak-btn-error { border-color: rgba(227,163,62,0.5); color: #E3A33E; }
        .speak-btn-error:hover:not(:disabled) { border-color: #E3A33E; background: rgba(227,163,62,0.12); }
        .prompt-text {
          font-size: clamp(24px, 6.5vw, 34px);
          margin: 0;
          word-break: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }
        .answer-area { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; }
        .answer-text {
          font-size: clamp(17px, 4.5vw, 22px);
          color: rgba(241,237,228,0.92);
          margin: 0;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .note-text { font-size: 13px; color: #9BA3AD; font-style: italic; margin: 8px 0 0; }

        .reveal-btn {
          margin-top: 30px; width: 100%; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15); background: transparent;
          color: #9BA3AD; padding: 13px; cursor: pointer;
          transition: all 0.15s ease;
        }
        .reveal-btn:hover { color: #F1EDE4; border-color: rgba(255,255,255,0.35); }

        .type-row { margin-top: 30px; display: flex; gap: 8px; }
        .type-input {
          flex: 1; border-radius: 12px; background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.15); padding: 13px 16px;
          color: #F1EDE4; font-size: 15px; font-family: 'Work Sans', sans-serif;
          outline: none; transition: border-color 0.15s ease;
        }
        .type-input::placeholder { color: rgba(155,163,173,0.6); }
        .type-input:focus { border-color: #7C93A8; }
        .check-btn {
          border-radius: 12px; padding: 13px 22px; background: #7C93A8;
          color: #171A1E; font-weight: 500; font-size: 14px; border: none; cursor: pointer;
          transition: filter 0.15s ease;
        }
        .check-btn:hover { filter: brightness(1.1); }

        .verdict-row { margin-top: 22px; display: flex; align-items: center; gap: 8px; }
        .link-btn {
          margin-left: auto; background: none; border: none; cursor: pointer;
          text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 4px;
          font-family: 'IBM Plex Mono', monospace; font-size: 12px;
        }
        .link-btn:hover { color: #F1EDE4; }

        .controls-row { align-items: center; }
        .flag-btn {
          display: flex; align-items: center; gap: 6px;
          border-radius: 999px; padding: 10px 16px; font-size: 12px;
          min-height: 40px;
          font-family: 'IBM Plex Mono', monospace; cursor: pointer; background: transparent;
          border: 1px solid; transition: all 0.15s ease;
        }
        .flag-gorse { color: #E3A33E; border-color: rgba(227,163,62,0.4); }
        .flag-gorse:hover { border-color: #E3A33E; }
        .flag-gorse.active { background: rgba(227,163,62,0.15); border-color: #E3A33E; }
        .flag-moss { color: #6FA287; border-color: rgba(111,162,135,0.4); }
        .flag-moss:hover { border-color: #6FA287; }
        .flag-moss.active { background: rgba(111,162,135,0.15); border-color: #6FA287; }

        .next-btn {
          margin-left: auto; display: flex; align-items: center; gap: 6px;
          border-radius: 999px; background: #F1EDE4; color: #171A1E;
          padding: 11px 22px; min-height: 40px; font-size: 14px; font-weight: 500; border: none; cursor: pointer;
          transition: filter 0.15s ease;
        }
        .next-btn:hover { filter: brightness(0.95); }

        .footer-text { margin-top: 30px; text-align: center; }
        .version-marker { margin-top: 6px; opacity: 0.55; }

        .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 96px 0; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .slate-card { padding: clamp(18px, 6vw, 26px) 16px; }
          .geirfa-header h1 { font-size: 22px; }
          .flag-btn, .next-btn { font-size: 12px; padding: 10px 14px; }
        }

        @media (max-width: 380px) {
          .type-row { flex-direction: column; }
          .check-btn { width: 100%; }
          .controls-row { flex-direction: column; align-items: stretch; }
          .next-btn { margin-left: 0; justify-content: center; }
        }

        @media (min-width: 900px) {
          .geirfa-root { max-width: 640px; }
          .geirfa-header h1 { font-size: 30px; }
          .slate-card { padding: 40px 36px; }
        }
      `}</style>
      <div className="geirfa-root">
        <header className="geirfa-header">
          <h1 className="chalk-display">Geirfa Sylfaen</h1>
          <p>Sylfaen y Gogledd — Revising Welsh Vocabulary</p>
        </header>
        {children}
      </div>
    </div>
  );
}

function GenderBadge({ g }) {
  const isMasc = g === "m";
  return (
    <span className={`gender-badge ${isMasc ? "gender-m" : "gender-f"}`}>
      {isMasc ? "g." : "b."}
    </span>
  );
}

function StatPill({ label, value, dotClass }) {
  return (
    <span className="stat-pill">
      <span className={`dot ${dotClass}`} />
      {label} {value}
    </span>
  );
}

function ToggleGroup({ children }) {
  return <div className="toggle-group">{children}</div>;
}

function ToggleButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`toggle-btn ${active ? "active" : ""}`}>
      {children}
    </button>
  );
}

function FlagButton({ active, variant, onClick, children }) {
  return (
    <button onClick={onClick} className={`flag-btn flag-${variant} ${active ? "active" : ""}`}>
      {children}
    </button>
  );
}

