import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

type Item = {
  proposal_id: string;
  job_id: string;
  customer_name: string;
  address: string;
  kind: string;
  subtotal_cents: number;
  policy_hits: string[];
  status: string;
};

type Detail = {
  job: { notes: string; trade: string };
  proposal: {
    customer_message: string;
    confidence: number;
    line_items: { sku: string; description: string; unit_cents: number; book_cents: number }[];
  };
};

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<Item | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`${API}/v1/queue?status=pending`);
    const json = await res.json();
    setItems(json.items ?? []);
  }, []);

  useEffect(() => {
    load().catch(() => setFlash("API not reachable. Start backend on :8000."));
  }, [load]);

  async function openItem(item: Item) {
    setActive(item);
    setDetail(null);
    try {
      const res = await fetch(`${API}/v1/jobs/${item.job_id}`);
      setDetail(await res.json());
    } catch {
      setFlash("Could not load proposal");
    }
  }

  async function decide(action: "approve" | "reject") {
    if (!active) return;
    setBusy(true);
    try {
      const res = await fetch(`${API}/v1/proposals/${active.proposal_id}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action,
          channel: "mobile",
          reason: action === "reject" ? "Owner rejected from truck" : null,
        }),
      });
      const json = await res.json();
      setFlash(action === "approve" ? `Sent · ${json.status}` : "Rejected");
      setActive(null);
      setDetail(null);
      await load();
    } catch {
      setFlash("Decision failed");
    } finally {
      setBusy(false);
    }
  }

  if (active) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.pad}>
          <Pressable onPress={() => { setActive(null); setDetail(null); }}>
            <Text style={styles.sub}>← Queue</Text>
          </Pressable>
          <Text style={styles.kicker}>{active.kind.replace("_", " ")}</Text>
          <Text style={styles.title}>{active.customer_name}</Text>
          <Text style={styles.sub}>{active.address}</Text>
          <Text style={styles.amount}>{dollars(active.subtotal_cents)}</Text>
          <Text style={styles.hits}>{active.policy_hits.join(" · ")}</Text>
          {detail ? (
            <View style={{ gap: 8, marginTop: 8 }}>
              <Text style={styles.body}>{detail.job.notes}</Text>
              <Text style={styles.sub}>{detail.proposal.customer_message}</Text>
              {detail.proposal.line_items.map((line) => (
                <View key={line.sku} style={styles.line}>
                  <Text style={styles.body}>{line.description}</Text>
                  <Text style={styles.body}>{dollars(line.unit_cents)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <ActivityIndicator color="#fff" />
          )}
          <Pressable style={styles.approve} disabled={busy} onPress={() => decide("approve")}>
            <Text style={styles.approveText}>{busy ? "Sending…" : "Approve & send"}</Text>
          </Pressable>
          <Pressable style={styles.reject} disabled={busy} onPress={() => decide("reject")}>
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={styles.title}>QuoteGate</Text>
        <Text style={styles.sub}>Approve quotes before they leave the truck.</Text>
        {flash ? <Text style={styles.flash}>{flash}</Text> : null}
        {items.length === 0 ? (
          <Text style={styles.sub}>No pending quotes. Create a job in the console, then refresh.</Text>
        ) : null}
        {items.map((item) => (
          <Pressable key={item.proposal_id} style={styles.card} onPress={() => openItem(item)}>
            <Text style={styles.cardTitle}>{item.customer_name}</Text>
            <Text style={styles.sub}>{item.address}</Text>
            <Text style={styles.amount}>{dollars(item.subtotal_cents)}</Text>
          </Pressable>
        ))}
        <Pressable onPress={load} style={styles.refresh}>
          <Text style={styles.rejectText}>Refresh queue</Text>
        </Pressable>
        {busy ? <ActivityIndicator color="#fff" /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f1115" },
  pad: { padding: 20, gap: 12 },
  title: { color: "#fff", fontSize: 24, fontWeight: "600" },
  kicker: { color: "#9aa3b2", textTransform: "uppercase", fontSize: 12 },
  sub: { color: "#9aa3b2" },
  body: { color: "#e8eaed" },
  amount: { color: "#fff", fontSize: 28, fontWeight: "600", marginVertical: 8 },
  hits: { color: "#c9a227", fontSize: 12 },
  line: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  card: { backgroundColor: "#1a1d24", padding: 16, borderRadius: 12, gap: 4 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  approve: { backgroundColor: "#2f6fed", padding: 16, borderRadius: 12, marginTop: 24 },
  approveText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  reject: { padding: 16 },
  rejectText: { color: "#9aa3b2", textAlign: "center" },
  refresh: { padding: 12 },
  flash: { color: "#3dd68c" },
});
