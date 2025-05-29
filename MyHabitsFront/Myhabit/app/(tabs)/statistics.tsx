import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { IconSymbol } from '@/components/ui/IconSymbol';
import type { IconSymbolName } from '@/components/ui/IconSymbol';

const screenWidth = Dimensions.get('window').width;

// Dummy data
const habits = [
  { id: 1, title: 'Su İçmek', completed: 25, streak: 7, lastCompleted: '2024-06-10' },
  { id: 2, title: 'Yürüyüş', completed: 18, streak: 3, lastCompleted: '2024-06-09' },
  { id: 3, title: 'Kitap Okumak', completed: 30, streak: 10, lastCompleted: '2024-06-10' },
];
const totalCompleted = habits.reduce((sum, h) => sum + h.completed, 0);
const bestStreak = Math.max(...habits.map(h => h.streak));
const activeHabits = habits.length;
const mostCompleted = habits.reduce((prev, curr) => (prev.completed > curr.completed ? prev : curr));

const last7Days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const last7Data = [1, 1, 0, 1, 1, 0, 1]; // Dummy: 1=başarılı, 0=başarısız
const weeklySuccess = (last7Data.filter(x => x === 1).length / 7) * 100;

export default function StatisticsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <ThemedText type="title" style={styles.header}>İstatistikler</ThemedText>
      <View style={styles.row}>
        <StatCard icon="house.fill" label="Toplam Tamamlanan" value={totalCompleted} color="#4CAF50" />
        <StatCard icon="chevron.right" label="En Uzun Streak" value={bestStreak} color="#FF9800" />
      </View>
      <View style={styles.row}>
        <StatCard icon="paperplane.fill" label="Aktif Alışkanlık" value={activeHabits} color="#2196F3" />
        <StatCard icon="chevron.left.forwardslash.chevron.right" label="En Çok Tamamlanan" value={mostCompleted.title} color="#FFD700" />
      </View>
      <View style={styles.chartContainer}>
        <ThemedText type="subtitle" style={styles.chartTitle}>Son 7 Günlük Başarı</ThemedText>
        <BarChart
          data={{
            labels: last7Days,
            datasets: [{ data: last7Data.map(x => x * 100) }],
          }}
          width={screenWidth - 32}
          height={180}
          yAxisLabel=""
          yAxisSuffix="%"
          fromZero
          chartConfig={chartConfig}
          style={styles.chart}
        />
        <ThemedText style={styles.successText}>Başarı Oranı: %{weeklySuccess.toFixed(0)}</ThemedText>
      </View>
      <View style={styles.chartContainer}>
        <ThemedText type="subtitle" style={styles.chartTitle}>Alışkanlık Bazında Tamamlanma</ThemedText>
        <ProgressChart
          data={{
            labels: habits.map(h => h.title),
            data: habits.map(h => h.completed / 30), // 30 gün üzerinden dummy
          }}
          width={screenWidth - 32}
          height={180}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <View style={styles.listContainer}>
        <ThemedText type="subtitle" style={styles.chartTitle}>Son Tamamlananlar</ThemedText>
        {habits.map(h => (
          <ThemedView key={h.id} style={styles.listItem}>
            <IconSymbol name={"house.fill" as IconSymbolName} size={22} color="#4CAF50" style={{ marginRight: 8 }} />
            <ThemedText>{h.title}</ThemedText>
            <ThemedText style={{ marginLeft: 'auto', color: '#888' }}>{h.lastCompleted}</ThemedText>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, label, value, color }: { icon: IconSymbolName; label: string; value: any; color: string }) {
  return (
    <ThemedView style={[styles.card, { borderColor: color }]}> 
      <IconSymbol name={icon} size={28} color={color} style={{ marginBottom: 4 }} />
      <ThemedText type="subtitle" style={{ color }}>{value}</ThemedText>
      <ThemedText style={styles.cardLabel}>{label}</ThemedText>
    </ThemedView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '6', strokeWidth: '2', stroke: '#2196F3' },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { marginBottom: 16, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
  },
  cardLabel: { fontSize: 13, color: '#888', marginTop: 2 },
  chartContainer: { backgroundColor: '#f8f8f8', borderRadius: 16, padding: 12, marginVertical: 10 },
  chartTitle: { marginBottom: 8 },
  chart: { borderRadius: 16 },
  successText: { textAlign: 'center', marginTop: 8, color: '#4CAF50', fontWeight: 'bold' },
  listContainer: { backgroundColor: '#f8f8f8', borderRadius: 16, padding: 12, marginTop: 16 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#eee' },
}); 