import 'package:fieldproof_core/fieldproof_core.dart';
import 'package:material_ui/material_ui.dart';

/// Root widget of the web console for supervisors, admins and client viewers.
class FieldProofConsoleApp extends StatelessWidget {
  const FieldProofConsoleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FieldProof Console',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B5CAD)),
      ),
      home: const ConsoleHomeScreen(),
    );
  }
}

/// Describes the console area each role will get. Sign-in and role-aware
/// navigation replace this screen in a later milestone.
class ConsoleHomeScreen extends StatelessWidget {
  const ConsoleHomeScreen({super.key});

  static const _areas = {
    Role.supervisor: 'Assign inspections, resolve conflicts, approve reports',
    Role.admin: 'Manage checklist templates, scoring rules and users',
    Role.clientViewer: 'Read approved reports for your own sites',
  };

  @override
  Widget build(BuildContext context) {
    final roles = Role.values.where((r) => r.usesConsole);
    return Scaffold(
      appBar: AppBar(title: const Text('FieldProof Console')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          for (final role in roles)
            Card(
              child: ListTile(
                title: Text(role.label),
                subtitle: Text(_areas[role]!),
              ),
            ),
        ],
      ),
    );
  }
}
