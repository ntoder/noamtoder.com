// noam-link.js — links your Game Hub login (Firebase) to your NoamBrowser account.
// When you're signed in to both on this device, your Game Hub profile remembers your NoamBrowser username,
// so the sign-in box fills it in and your profile page shows it. Your NoamBrowser password and data never
// go to the Game Hub: they stay locked with your own password.
import { auth, db } from '/firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

let fbUser = null, profile = null;
const info = () => ({ name: profile ? profile.name : fbUser ? fbUser.displayName || '' : '', noamAccount: profile ? profile.noamAccount || '' : '', signedIn: !!fbUser });
window.GameHubLink = { get: info };
const tell = () => dispatchEvent(new CustomEvent('gamehub-user', { detail: info() }));
async function link() {
  const nu = window.NoamCore && window.NoamCore.user();
  if (!fbUser || !profile || !nu || profile.noamAccount === nu) return;
  try { await updateDoc(doc(db, 'users', fbUser.uid), { noamAccount: nu }); profile.noamAccount = nu; tell(); } catch (e) { console.warn('link', e.message); }
}
onAuthStateChanged(auth, async (u) => {
  fbUser = u; profile = null;
  if (u) { try { profile = (await getDoc(doc(db, 'users', u.uid))).data() || null; } catch {} }
  tell(); link();
});
window.NoamCore && window.NoamCore.on('account:status', link);
