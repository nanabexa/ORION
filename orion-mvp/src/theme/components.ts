import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing, radius } from './spacing';

export const common = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Navbar
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.navTop,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  navBack: {
    fontSize: 22,
    color: colors.textMuted,
  },
  navTitleText: {
    fontWeight: '900',
    fontSize: 13,
    color: colors.text,
    letterSpacing: 3,
  },

  // Inputs
  input: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 13,
    color: colors.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  inputFlex: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 11,
    color: colors.error,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: spacing.md,
  },

  // Botones
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: 14,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnSecondary: {
    borderWidth: 0.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: colors.accent,
    fontSize: 13,
  },
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 13,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Sección label
  sectionLabel: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 4,
  },

  // Link
  link: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textMuted,
  },
  linkAccent: {
    color: colors.accent,
  },

  // Eye icon
  eyeIcon: {
    fontSize: 16,
    paddingLeft: 8,
  },
});