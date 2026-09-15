import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import NursePatients from '../src/screens/admin/nursing/nursingDashboard/NursePatients';
import NurseEmar from '../src/screens/admin/nursing/nursingDashboard/NurseEmar';
import MedicalRecordsModal from '../src/components/nursing/MedicalRecordsModal';

const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
jest.setTimeout(30000);
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('../src/context/AppContext', () => ({
  useApp: () => ({ notifications: [], showToast: mockShowToast }),
}));
jest.mock('lucide-react-native', () => {
  const ReactModule = require('react');
  const { View } = require('react-native');
  const Icon = () => ReactModule.createElement(View);
  return Object.fromEntries(
    [
      'AlertTriangle',
      'Bell',
      'MapPin',
      'SlidersHorizontal',
      'Stethoscope',
      'FileText',
      'HeartPulse',
      'RefreshCw',
      'Search',
      'X',
      'CheckCircle2',
      'ShieldAlert',
      'Syringe',
      'Volume2',
    ].map(name => [name, Icon]),
  );
});

let renderer: ReactTestRenderer.ReactTestRenderer;

async function render(screen: React.ReactElement) {
  await act(() => {
    renderer = ReactTestRenderer.create(screen);
  });
}

async function press(label: string) {
  const button = renderer.root
    .findAllByType(TouchableOpacity)
    .find(
      node =>
        node.props.accessibilityLabel === label ||
        node
          .findAllByType(Text)
          .some(text =>
            React.Children.toArray(text.props.children)
              .join('')
              .includes(label),
          ),
    );
  if (!button) {
    throw new Error(`Button not found: ${label}`);
  }
  await act(() => button!.props.onPress());
}

beforeEach(() => jest.clearAllMocks());
afterEach(async () => {
  if (renderer) {
    await act(() => renderer.unmount());
  }
  jest.restoreAllMocks();
});

test('patient search and clinical filters still select the correct records', async () => {
  await render(<NursePatients />);
  await press('Critical Vitals');
  await press('Medical Records');
  expect(renderer.root.findByType(MedicalRecordsModal).props.patient.name).toBe(
    'Eleanor Zhang',
  );
  await press('Close medical records');
  await press('All Assigned');
  await act(() =>
    renderer.root.findByType(TextInput).props.onChangeText('MRN-645012'),
  );
  await press('Medical Records');
  expect(renderer.root.findByType(MedicalRecordsModal).props.patient.name).toBe(
    'Teresa Morales',
  );
});

test('medical records dismiss and open the existing eMAR route', async () => {
  await render(<NursePatients />);
  await press('Medical Records');
  await press('Open eMAR Schedule for Arthur Pendelton');
  expect(mockNavigate).toHaveBeenCalledWith('NurseEmar');
  expect(renderer.root.findAllByType(MedicalRecordsModal)).toHaveLength(0);
  await press('Sync Monitors');
  expect(mockShowToast).toHaveBeenCalledWith(
    'Live monitors synchronised.',
    'success',
  );
});

test('eMAR preserves urgent filtering, dose previews, and filter reset', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await render(<NurseEmar />);
  await press('Dual-Verify & Administer');
  expect(alert).toHaveBeenLastCalledWith(
    'Dual-Verify & Administer',
    expect.stringContaining('Heparin Sodium IV Infusion'),
  );
  await press('Take Action');
  expect(renderer.root.findByType(TextInput).props.value).toBe('Eleanor Zhang');
  await press('Hold / Omit');
  expect(alert).toHaveBeenLastCalledWith(
    'Hold / Omit Dose',
    expect.stringContaining('Furosemide (Lasix) IV Push'),
  );
  await act(() =>
    renderer.root
      .findByType(TextInput)
      .props.onChangeText('no matching medication'),
  );
  await press('Reset filters');
  expect(renderer.root.findByType(TextInput).props.value).toBe('');
  await press('Dual-Verify & Administer');
  expect(alert).toHaveBeenLastCalledWith(
    'Dual-Verify & Administer',
    expect.stringContaining('Heparin Sodium IV Infusion'),
  );
});
