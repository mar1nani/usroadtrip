import { useEffect, useState } from "react";
import { C } from "../styles/theme";
import Card from "../components/ui/Card";
import LoadingState from "../components/ui/LoadingState";
import { loadSettings, saveSettingsPatch } from "../services/settingsService";
import { clearAll } from "../services/offline/localCache";
import { useAuth } from "../hooks/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import RestrictedNotice from "../components/auth/RestrictedNotice";
import FlightForm from "../components/trip/FlightForm";

const ROLE_LABELS = { marouane: "Marouane", isabelle: "Isabelle", guest: "Invité" };

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [rateDraft, setRateDraft] = useState("");
  const [timeDraft, setTimeDraft] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwStatus, setPwStatus] = useState("");
  const { user, passwordRecovery, clearPasswordRecovery, signInWithPassword, signOut, sendPasswordReset, updatePassword } = useAuth();
  const { role, canSeeSettings } = usePermissions();

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setRateDraft(String(s.usdToEur));
      setTimeDraft(s.departureTime || "");
    });
  }, []);

  if (!settings) return <LoadingState />;

  async function saveRate() {
    const n = parseFloat(rateDraft);
    if (!Number.isNaN(n) && n > 0) {
      const next = await saveSettingsPatch({ usdToEur: n, usdToEurUpdatedAt: new Date().toISOString() });
      setSettings(next);
    }
  }

  async function saveTime() {
    const next = await saveSettingsPatch({ departureTime: timeDraft });
    setSettings(next);
  }

  async function setGpsMode(gpsMode) {
    const next = await saveSettingsPatch({ gpsMode });
    setSettings(next);
  }

  async function handleReset() {
    if (
      !confirm(
        "Réinitialiser toutes les données locales (progression, réservations, courses, checklist, documents, réglages) ? Cette action est irréversible."
      )
    )
      return;
    await clearAll();
    window.location.reload();
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setAuthStatus("sending");
    try {
      await signInWithPassword(email.trim(), password);
      setPassword("");
      setAuthStatus("");
    } catch (err) {
      console.warn("Échec de la connexion :", err);
      setAuthStatus("error");
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setResetStatus("need-email");
      return;
    }
    setResetStatus("sending");
    try {
      await sendPasswordReset(email.trim());
      setResetStatus("sent");
    } catch (err) {
      console.warn("Échec de l'envoi de l'email de réinitialisation :", err);
      setResetStatus(err?.status === 429 ? "rate-limited" : "error");
    }
  }

  async function handleSetPassword(e) {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPwStatus("too-short");
      return;
    }
    setPwStatus("saving");
    try {
      await updatePassword(newPassword);
      setNewPassword("");
      setPwStatus("done");
      clearPasswordRecovery();
    } catch (err) {
      console.warn("Échec de la mise à jour du mot de passe :", err);
      setPwStatus("error");
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      <div style={{ fontSize: 18, color: C.gold, fontWeight: 700, marginBottom: 16 }}>⚙️ Paramètres</div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>Compte</div>
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>
          Rôle actuel : <span style={{ color: C.gold, fontWeight: 700 }}>{ROLE_LABELS[role]}</span>
        </div>
        {user && !passwordRecovery ? (
          <>
            <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>
              Connecté en tant que <span style={{ color: C.cream }}>{user.email}</span>
            </div>
            <button
              onClick={signOut}
              style={{ background: C.accent, border: `1px solid ${C.line}`, borderRadius: 9, padding: "9px 14px", color: C.cream, cursor: "pointer", marginBottom: 14 }}
            >
              Se déconnecter
            </button>

            <div style={{ fontSize: 12, color: C.cream, fontWeight: 600, marginBottom: 8 }}>🔑 Changer mon mot de passe</div>
            <form onSubmit={handleSetPassword} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                style={{ flex: 1, minWidth: 160, background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.cream, fontSize: 14 }}
              />
              <button
                type="submit"
                disabled={pwStatus === "saving"}
                style={{ background: C.accent, border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 16px", color: C.cream, fontWeight: 600, cursor: "pointer" }}
              >
                {pwStatus === "saving" ? "..." : "Mettre à jour"}
              </button>
            </form>
            {pwStatus === "done" && <div style={{ fontSize: 12, color: "#3a8f5c", marginTop: 8 }}>✓ Mot de passe mis à jour.</div>}
            {pwStatus === "too-short" && <div style={{ fontSize: 12, color: C.red, marginTop: 8 }}>6 caractères minimum.</div>}
            {pwStatus === "error" && <div style={{ fontSize: 12, color: C.red, marginTop: 8 }}>Erreur — réessaie.</div>}
          </>
        ) : passwordRecovery ? (
          <>
            <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>
              Définis ton mot de passe pour te connecter directement la prochaine fois.
            </div>
            <form onSubmit={handleSetPassword} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ton mot de passe"
                style={{ flex: 1, minWidth: 160, background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.cream, fontSize: 14 }}
              />
              <button
                type="submit"
                disabled={pwStatus === "saving"}
                style={{ background: `linear-gradient(135deg,${C.gold},#9a7420)`, border: "none", borderRadius: 8, padding: "9px 16px", color: "#1a1200", fontWeight: 700, cursor: "pointer" }}
              >
                {pwStatus === "saving" ? "..." : "Définir"}
              </button>
            </form>
            {pwStatus === "done" && <div style={{ fontSize: 12, color: "#3a8f5c", marginTop: 8 }}>✓ Mot de passe défini — tu es connecté.</div>}
            {pwStatus === "too-short" && <div style={{ fontSize: 12, color: C.red, marginTop: 8 }}>6 caractères minimum.</div>}
            {pwStatus === "error" && <div style={{ fontSize: 12, color: C.red, marginTop: 8 }}>Erreur — réessaie.</div>}
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>
              Connecte-toi avec ton email et ton mot de passe pour accéder à tes notes, dépenses et vol personnels.
            </div>
            <form onSubmit={handleLogin} style={{ display: "grid", gap: 8 }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                style={{ background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.cream, fontSize: 14 }}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                style={{ background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.cream, fontSize: 14 }}
              />
              <button
                type="submit"
                disabled={authStatus === "sending"}
                style={{ background: `linear-gradient(135deg,${C.gold},#9a7420)`, border: "none", borderRadius: 8, padding: "9px 16px", color: "#1a1200", fontWeight: 700, cursor: "pointer" }}
              >
                Se connecter
              </button>
            </form>
            {authStatus === "error" && <div style={{ fontSize: 12, color: C.red, marginTop: 8 }}>Email ou mot de passe incorrect.</div>}

            <button
              type="button"
              onClick={handleForgotPassword}
              style={{ background: "none", border: "none", color: C.gold, fontSize: 11.5, marginTop: 10, cursor: "pointer", textDecoration: "underline", padding: 0 }}
            >
              Mot de passe oublié / pas encore défini ?
            </button>
            {resetStatus === "need-email" && <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>Renseigne d'abord ton email ci-dessus.</div>}
            {resetStatus === "sent" && <div style={{ fontSize: 12, color: "#3a8f5c", marginTop: 6 }}>✓ Email envoyé — clique le lien pour définir ton mot de passe.</div>}
            {resetStatus === "rate-limited" && (
              <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>Trop de tentatives — réessaie dans une minute.</div>
            )}
            {resetStatus === "error" && <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>Erreur — Supabase est-il configuré ?</div>}
          </>
        )}
      </Card>

      {!canSeeSettings ? (
        <RestrictedNotice />
      ) : (
        <>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>💱 Taux de change</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.dim }}>1 $ =</span>
              <input
                value={rateDraft}
                onChange={(e) => setRateDraft(e.target.value)}
                onBlur={saveRate}
                style={{ width: 80, background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 9px", color: C.gold, fontSize: 14 }}
              />
              <span style={{ fontSize: 13, color: C.dim }}>€</span>
            </div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>
              Utilisé dans le Convertisseur. Saisi manuellement (hors-ligne) — vérifie le taux réel avant de convertir de grosses sommes.
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>🕓 Heure de départ</div>
            <input
              type="time"
              value={timeDraft}
              onChange={(e) => setTimeDraft(e.target.value)}
              onBlur={saveTime}
              style={{ background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 9px", color: C.cream, fontSize: 14 }}
            />
            <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>Affichée sur le compte à rebours de l'accueil.</div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>📍 Position de la voiture sur la carte</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                ["simulation", "Simulation (Chicago)"],
                ["real", "GPS réel"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setGpsMode(value)}
                  style={{
                    background: settings.gpsMode === value ? C.gold : C.accent,
                    color: settings.gpsMode === value ? "#1a1200" : C.cream,
                    border: `1px solid ${C.line}`,
                    borderRadius: 20,
                    padding: "7px 14px",
                    fontSize: 12.5,
                    fontWeight: settings.gpsMode === value ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>
              "Simulation" place la voiture sur Chicago tant que le vrai road trip n'a pas commencé. "GPS réel" utilise ta position (demande une autorisation de localisation) et accroche la voiture à l'étape la plus proche.
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>✈️ Mon vol</div>
            <FlightForm scope={role === "guest" ? "marouane" : role} />
          </Card>

          <Card>
            <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>Données</div>
            <div style={{ fontSize: 11, color: C.dim, marginBottom: 10 }}>
              Toutes tes données (progression, réservations, courses, checklist, documents, réglages) sont stockées uniquement sur cet appareil.
            </div>
            <button
              onClick={handleReset}
              style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 9, padding: "10px 16px", color: C.red, cursor: "pointer" }}
            >
              Réinitialiser toutes les données locales
            </button>
          </Card>
        </>
      )}
    </div>
  );
}
