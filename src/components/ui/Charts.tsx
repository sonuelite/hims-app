import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

import {
  Colors,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
} from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export function SimpleChart({
  data,
  labels,
  color = Colors.primary[500],
  height = 120,
  unit = '',
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  unit?: string;
}) {
  if (data.length === 0) {
    return null;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const chartWidth =
    screenWidth - Spacing.base * 2 - 40;

  const barWidth =
    (chartWidth / data.length) * 0.6;

  return (
    <View
      style={[
        styles.chartContainer,
        { height },
      ]}
    >
      <View style={styles.chartArea}>
        {data.map((value, index) => {
          const barHeight =
            ((value - min) / range) *
              (height - 40) +
            10;

          return (
            <View
              key={index}
              style={styles.barWrapper}
            >
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    width: barWidth,
                    backgroundColor: color,
                  },
                ]}
              />

              <Text style={styles.barLabel}>
                {labels[index]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function LineChart({
  data,
  labels,
  color = Colors.primary[500],
  height = 120,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}) {
  if (data.length < 2) {
    return null;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const chartWidth =
    screenWidth - Spacing.base * 2 - 40;

  const stepX =
    chartWidth / (data.length - 1);

  const points = data.map((value, index) => {
    const x = index * stepX;

    const y =
      height -
      30 -
      ((value - min) / range) *
        (height - 50);

    return {
      x,
      y,
    };
  });

  return (
    <View
      style={[
        styles.chartContainer,
        { height },
      ]}
    >
      <View style={styles.chartArea}>
        {/* Grid Lines */}
        <View style={StyleSheet.absoluteFill}>
          {[0.25, 0.5, 0.75].map(
            ratio => (
              <View
                key={ratio}
                style={[
                  styles.gridLine,
                  {
                    top:
                      (height - 30) *
                      ratio,
                  },
                ]}
              />
            ),
          )}
        </View>

        {/* Data Points */}
        <View style={StyleSheet.absoluteFill}>
          {points.map((point, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  left: point.x - 4,
                  top: point.y - 4,
                  backgroundColor: color,
                },
              ]}
            />
          ))}
        </View>

        {/* Labels */}
        <View style={styles.labelsRow}>
          {labels.map(
            (label, index) => (
              <Text
                key={index}
                style={styles.chartLabel}
              >
                {label}
              </Text>
            ),
          )}
        </View>
      </View>
    </View>
  );
}

export function DonutChart({
  segments,
  size = 140,
}: {
  segments: {
    value: number;
    color: string;
    label: string;
  }[];
  size?: number;
}) {
  const total =
    segments.reduce(
      (sum, segment) =>
        sum + segment.value,
      0,
    ) || 1;

  const radius = size / 2;
  const strokeWidth = 16;

  return (
    <View style={styles.donutContainer}>
      <View
        style={[
          styles.donut,
          {
            width: size,
            height: size,
          },
        ]}
      >
        {segments.map(
          (segment, index) => {
            return (
              <View
                key={index}
                style={StyleSheet.absoluteFill}
              >
                <View
                  style={{
                    width: size,
                    height: size,
                    borderRadius: radius,
                    borderWidth:
                      strokeWidth,
                    borderColor:
                      segment.color,
                    borderStyle:
                      'dashed',
                    overflow: 'hidden',
                  }}
                />
              </View>
            );
          },
        )}

        {/* Donut Center */}
        <View
          style={styles.donutCenter}
        >
          <Text
            style={styles.donutTotal}
          >
            {total}
          </Text>

          <Text
            style={styles.donutLabel}
          >
            Total
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {segments.map(
          (segment, index) => (
            <View
              key={index}
              style={styles.legendItem}
            >
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor:
                      segment.color,
                  },
                ]}
              />

              <Text
                style={styles.legendText}
              >
                {segment.label}:{' '}
                {segment.value}
              </Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
}

export function ProgressBar({
  value,
  max,
  color = Colors.primary[500],
  height = 8,
}: {
  value: number;
  max: number;
  color?: string;
  height?: number;
}) {
  const percentage =
    max > 0
      ? Math.min(
          (value / max) * 100,
          100,
        )
      : 0;

  return (
    <View
      style={[
        styles.progressTrack,
        { height },
      ]}
    >
      <View
        style={[
          styles.progressFill,
          {
            width: `${percentage}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: Colors.neutral[50],
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },

  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },

  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  bar: {
    borderRadius: 4,
  },

  barLabel: {
    fontSize: 9,
    color: Colors.neutral[400],
    marginTop: Spacing.xs,
    fontWeight: FontWeight.medium,
  },

  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor:
      Colors.neutral[100],
  },

  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  labelsRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  chartLabel: {
    fontSize: 9,
    color: Colors.neutral[400],
    fontWeight: FontWeight.medium,
  },

  donutContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },

  donut: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
  },

  donutTotal: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  donutLabel: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    fontWeight: FontWeight.medium,
  },

  legend: {
    gap: Spacing.sm,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    fontSize: FontSize.sm,
    color: Colors.neutral[600],
    fontWeight: FontWeight.medium,
  },

  progressTrack: {
    backgroundColor:
      Colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    borderRadius: 4,
  },
});