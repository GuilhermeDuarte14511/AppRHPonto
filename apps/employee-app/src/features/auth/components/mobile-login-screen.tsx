import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { loginSchema, type LoginSchema } from '@rh-ponto/validations';

import { AppIcon } from '@/shared/components/app-icon';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

const employeeCredentials = {
  email: 'employee@empresa.com',
  password: 'employee123',
} satisfies LoginSchema;

const backendModeLabel = {
  firebase: 'Conectado à autenticação real',
  mock: 'Modo demonstração ativo',
} as const;

export const MobileLoginScreen = () => {
  const { backendMode, signIn } = useAppSession();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: employeeCredentials,
  });
  const emailField = useController({
    control: form.control,
    name: 'email',
  });
  const passwordField = useController({
    control: form.control,
    name: 'password',
  });

  const handleSignIn = form.handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      await signIn(values);
      router.replace('/(tabs)');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível entrar no aplicativo.');
    }
  });

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.container}>
          <View style={styles.hero}>
            <View style={styles.logo}>
              <AppIcon color="#ffffff" name="time" size={34} />
            </View>
            <Text style={styles.appTitle}>Ponto Eletrônico</Text>
            <Text style={styles.appSubtitle}>GESTÃO DE TEMPO COM PRECISÃO</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Seja bem-vindo</Text>
            <Text style={styles.description}>Insira suas credenciais para acessar sua conta no aplicativo do colaborador.</Text>

            <View style={styles.backendBadge}>
              <Text style={styles.backendBadgeText}>{backendModeLabel[backendMode]}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>E-mail corporativo</Text>
                <View>
                  <View style={[styles.inputContainer, emailField.fieldState.error ? styles.inputContainerError : null]}>
                    <AppIcon color={mobileTheme.subtleText} name="mail-outline" size={18} />
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="email"
                      keyboardType="email-address"
                      placeholder="nome@empresa.com.br"
                      placeholderTextColor={mobileTheme.subtleText}
                      returnKeyType="next"
                      style={styles.input}
                      value={emailField.field.value}
                      onBlur={emailField.field.onBlur}
                      onChangeText={emailField.field.onChange}
                    />
                  </View>
                  {emailField.fieldState.error ? <Text style={styles.errorText}>{emailField.fieldState.error.message}</Text> : null}
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>Senha</Text>
                  <Text style={styles.helperLink}>Esqueci minha senha</Text>
                </View>
                <View>
                  <View style={[styles.inputContainer, passwordField.fieldState.error ? styles.inputContainerError : null]}>
                    <AppIcon color={mobileTheme.subtleText} name="lock-closed-outline" size={18} />
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="password"
                      placeholder="••••••••"
                      placeholderTextColor={mobileTheme.subtleText}
                      secureTextEntry={!isPasswordVisible}
                      style={styles.input}
                      value={passwordField.field.value}
                      onBlur={passwordField.field.onBlur}
                      onChangeText={passwordField.field.onChange}
                    />
                    <Pressable
                      accessibilityRole="button"
                      hitSlop={8}
                      onPress={() => setIsPasswordVisible((current) => !current)}
                    >
                      <AppIcon
                        color={mobileTheme.subtleText}
                        name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                      />
                    </Pressable>
                  </View>
                  {passwordField.fieldState.error ? <Text style={styles.errorText}>{passwordField.fieldState.error.message}</Text> : null}
                </View>
              </View>

              {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

              <Pressable
                disabled={form.formState.isSubmitting}
                style={[styles.primaryButton, form.formState.isSubmitting ? styles.buttonDisabled : null]}
                onPress={() => void handleSignIn()}
              >
                {form.formState.isSubmitting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Entrar</Text>
                    <AppIcon color="#ffffff" name="arrow-forward" size={18} />
                  </>
                )}
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={() => {
                  form.reset(employeeCredentials);
                  setSubmitError(null);
                }}
              >
                <Text style={styles.secondaryButtonText}>Usar conta de demonstração</Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Não consegue acessar? <Text style={styles.footerLink}>Fale com o RH</Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mobileTheme.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: mobileTheme.background,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primary,
    shadowColor: mobileTheme.primary,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    elevation: 5,
  },
  appTitle: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1.2,
    color: mobileTheme.text,
  },
  appSubtitle: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: mobileTheme.mutedText,
  },
  card: {
    borderRadius: 28,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 24,
    gap: 18,
    shadowColor: mobileTheme.primary,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
  },
  backendBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: mobileTheme.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backendBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: mobileTheme.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.mutedText,
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helperLink: {
    fontSize: 12,
    fontWeight: '600',
    color: mobileTheme.primary,
  },
  inputContainer: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceHigh,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainerError: {
    backgroundColor: '#ffe4e1',
  },
  input: {
    flex: 1,
    color: mobileTheme.text,
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.danger,
  },
  submitError: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.danger,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: mobileTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: mobileTheme.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  footer: {
    marginTop: 4,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
  },
  footerText: {
    textAlign: 'center',
    color: mobileTheme.mutedText,
    fontSize: 12,
  },
  footerLink: {
    color: mobileTheme.primary,
    fontWeight: '700',
  },
});
