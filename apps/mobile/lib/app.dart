import 'package:fieldproof_core/fieldproof_core.dart';
import 'package:material_ui/material_ui.dart';

/// Root widget of the technician app.
class FieldProofMobileApp extends StatelessWidget {
  const FieldProofMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FieldProof',
      debugShowCheckedModeBanner: false,
      theme: _outdoorTheme(),
      home: const AssignmentsPlaceholderScreen(),
    );
  }
}

/// High-contrast light theme with large tap targets, for use outdoors and
/// with gloves.
ThemeData _outdoorTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: const Color(0xFF0B5CAD),
    contrastLevel: 1.0,
  );
  return ThemeData(
    colorScheme: scheme,
    materialTapTargetSize: MaterialTapTargetSize.padded,
    visualDensity: VisualDensity.standard,
  );
}

/// First screen a technician sees. Assignments arrive with sign-in in a later
/// milestone; until then the screen states what it will show.
class AssignmentsPlaceholderScreen extends StatelessWidget {
  const AssignmentsPlaceholderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('FieldProof')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('My assignments', style: textTheme.headlineSmall),
              const SizedBox(height: 12),
              Text(
                'Inspections assigned to you as a '
                '${Role.technician.label.toLowerCase()} will appear here, '
                'including when you are offline.',
                style: textTheme.bodyLarge,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
