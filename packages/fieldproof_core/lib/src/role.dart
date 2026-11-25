import 'wire_enum.dart';

/// A user's role inside one organization.
///
/// Roles are issued as custom claims by a Cloud Function and enforced by
/// security rules. Client code only uses them to decide what to show.
enum Role implements WireEnum {
  /// Completes assigned inspections in the mobile app.
  technician('technician', 'Technician'),

  /// Assigns work, resolves conflicts and approves reports in the console.
  supervisor('supervisor', 'Supervisor'),

  /// Reads approved reports for their own sites; never sees drafts.
  clientViewer('client_viewer', 'Client viewer'),

  /// Manages checklist templates, scoring rules and users.
  admin('admin', 'Admin');

  const Role(this.wireName, this.label);

  @override
  final String wireName;

  /// Human-readable name for menus and badges.
  final String label;

  /// Parses the `role` custom claim. Throws [FormatException] if unknown.
  static Role fromWire(String wireName) =>
      parseWireName(values, wireName, 'role');

  /// Whether this role works in the Flutter web console rather than the
  /// mobile app.
  bool get usesConsole => this != Role.technician;
}
