import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { scale } from '../../../utils/scale'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackHeader from '../../../components/backHeader/BackHeader'
import { Chip, Input } from '../../../components/input/Input'
import CustomButton from '../../../components/customButton/CustomButton'
import { ColorConstants } from '../../../constants/colorConstants'
import { Fontconstants } from '../../../constants/fontConstants'
import { Stepper } from '../../../components/dataDisplay/DataDisplay'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'

// const STEPS = ['Basic', 'Medical', 'Contact', 'Insurance'];
const STEPS = ['Basic'];
type SignupScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Signup'
>;

const Signup = () => {
    const navigation = useNavigation<SignupScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0);

    const [form, setForm] = useState({
        name: '', dob: '', gender: 'Male' as 'Male' | 'Female' | 'Other',
        mobile: '', email: '',
        bloodGroup: 'O+', allergies: '', conditions: '', medications: '',
        address: '', city: '', state: '', emergencyName: '', emergencyRelation: '', emergencyPhone: '',
        insuranceProvider: '', policyNumber: '', tpa: '',
    });
    const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
    // const handleNext = () => {
    //     if (step === 0) {
    //       if (!form.name || !form.dob || !form.mobile) { showToast('Please fill all required fields', 'error'); return; }
    //     }
    //     if (step < STEPS.length - 1) { setStep(step + 1); return; }
    //     handleSubmit();
    //   };
    const handleNext = () => {
        // Step 0 validation
        if (step === 0) {
            if (!form.name || !form.dob || !form.mobile) {
                console.log('Please fill all required fields');
                return;
            }
        }

        // Go to next step
        if (step < STEPS.length - 1) {
            setStep(prev => prev + 1);
            return;
        }

        // Last step
        handleSubmit();
    };
    const handleSubmit = () => {
        const patient = {
            name: form.name,
            dob: form.dob,
            gender: form.gender,
            mobile: form.mobile,
            email: form.email,
            bloodGroup: form.bloodGroup,

            allergies: form.allergies
                ? form.allergies.split(',').map(s => s.trim())
                : [],

            conditions: form.conditions
                ? form.conditions.split(',').map(s => s.trim())
                : [],

            medications: form.medications
                ? form.medications.split(',').map(s => s.trim())
                : [],

            address: form.address,
            city: form.city,
            state: form.state,

            emergencyContact: {
                name: form.emergencyName,
                relation: form.emergencyRelation,
                phone: form.emergencyPhone,
            },

            //   insurance: form.insuranceProvider
            //     ? {
            //         provider: form.insuranceProvider,
            //         policyNumber: form.policyNumber,
            //         tpa: form.tpa,
            //       }
            //     : null,
        };
        // navigation.replace('PatientTabs');
        navigation.navigate('Otp');
        // console.log('Patient:', patient);
    };
    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                },
            ]}
        >
            <BackHeader title='Patient Registration' />
            {/* <View style={styles.stepperWrap}>
                <Stepper steps={STEPS} current={step} />
            </View> */}
            {/* <Text style={styles.stepTitle}>
                Basic Details
            </Text> */}
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {step === 0 && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Basic Details</Text>
                            <Input label="Full Name *" value={form.name} onChangeText={v => update('name', v)} placeholder="Enter full name" />
                            <Input label="Date of Birth *" value={form.dob} onChangeText={v => update('dob', v)} placeholder="YYYY-MM-DD" />
                            <Text style={styles.label}>Gender</Text>
                            <View style={styles.chipRow}>
                                {(['Male', 'Female', 'Other'] as const).map(g => (
                                    <Chip key={g} label={g} selected={form.gender === g} onPress={() => update('gender', g)} />
                                ))}
                            </View>
                            <Input label="Mobile Number *" value={form.mobile} onChangeText={v => update('mobile', v)} placeholder="+91 98765 43210" keyboardType="phone-pad" />
                            <Input label="Email" value={form.email} onChangeText={v => update('email', v)} placeholder="you@example.com" keyboardType="email-address" />
                        </View>
                    )}

                    {/* {step === 1 && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Medical Details</Text>
                            <Text style={styles.label}>Blood Group</Text>
                            <View style={styles.chipRow}>
                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                    <Chip key={bg} label={bg} selected={form.bloodGroup === bg} onPress={() => update('bloodGroup', bg)} />
                                ))}
                            </View>
                            <Input label="Allergies" value={form.allergies} onChangeText={v => update('allergies', v)} placeholder="Penicillin, Dust (comma separated)" multiline />
                            <Input label="Existing Conditions" value={form.conditions} onChangeText={v => update('conditions', v)} placeholder="Hypertension, Diabetes" multiline />
                            <Input label="Current Medication" value={form.medications} onChangeText={v => update('medications', v)} placeholder="Amlodipine 5mg" multiline />
                        </View>
                    )} */}

                    {/* {step === 2 && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Contact Details</Text>
                            <Input label="Address" value={form.address} onChangeText={v => update('address', v)} placeholder="Street address" multiline />
                            <Input label="City" value={form.city} onChangeText={v => update('city', v)} placeholder="Bengaluru" />
                            <Input label="State" value={form.state} onChangeText={v => update('state', v)} placeholder="Karnataka" />
                            <Input label="Emergency Contact Name" value={form.emergencyName} onChangeText={v => update('emergencyName', v)} placeholder="Contact name" />
                            <Input label="Relationship" value={form.emergencyRelation} onChangeText={v => update('emergencyRelation', v)} placeholder="Spouse, Parent" />
                            <Input label="Emergency Phone" value={form.emergencyPhone} onChangeText={v => update('emergencyPhone', v)} placeholder="+91 98765 43210" keyboardType="phone-pad" />
                        </View>
                    )} */}

                    {/* {step === 3 && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Insurance Details</Text>
                            <Text style={styles.hint}>Optional - skip if not applicable</Text>
                            <Input label="Insurance Provider" value={form.insuranceProvider} onChangeText={v => update('insuranceProvider', v)} placeholder="Star Health, ICICI Lombard" />
                            <Input label="Policy Number" value={form.policyNumber} onChangeText={v => update('policyNumber', v)} placeholder="SH-2024-001234" />
                            <Input label="TPA" value={form.tpa} onChangeText={v => update('tpa', v)} placeholder="Star TPA" />
                            <View style={styles.summaryBox}>
                                <Text style={styles.summaryTitle}>Ready to Register</Text>
                                <Text style={styles.summaryText}>Review your details and tap "Register" to create your patient account at MediCare Health.</Text>
                            </View>
                        </View>
                    )} */}
                    <CustomButton
                        disable={false}
                        title="Continue"
                        topHeight={30}
                        bgColor={ColorConstants.BTNCOLOR}
                        fontsize={14}
                        fontfamily={Fontconstants.SEMIBOLD}
                        bordRadius={scale(12)}
                        onPress={handleNext}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            {/* <View style={styles.continueBtnView}>
                            <CustomButton
                disable={false}
                title="Continue"
                width={343}
                topHeight={0}
                bgColor={ColorConstants.BTNCOLOR}
                fontsize={14}
                fontfamily={Fontconstants.SEMIBOLD}
                bordRadius={scale(12)}
                onPress={handleNext}
            />
            </View> */}
        </View>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(24),
        backgroundColor: Colors.neutral[50],
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    stepTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.neutral[900],
        marginBottom: Spacing.md
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.neutral[700],
        marginBottom: Spacing.sm
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: Spacing.md
    },
    stepperWrap: {
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.md
    },
    scroll: {
        // paddingHorizontal: Spacing.base, 
        paddingBottom: Spacing.xxxl
        // backgroundColor: 'red'
    },
    stepContent: { paddingTop: Spacing.md },
    hint: { fontSize: FontSize.sm, color: Colors.neutral[400], marginBottom: Spacing.md },
    summaryBox: { backgroundColor: Colors.primary[50], borderRadius: Radius.lg, padding: Spacing.base, marginTop: Spacing.lg },
    summaryTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.primary[700], marginBottom: Spacing.xs },
    summaryText: { fontSize: FontSize.sm, color: Colors.neutral[600], lineHeight: 20 },
    // continueBtnView: {
    //     position: 'absolute',
    //     bottom: scale(50),
    //     alignSelf: 'center'
    // }
})