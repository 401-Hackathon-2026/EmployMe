import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    paddingVertical: 30,
    paddingHorizontal: 40,
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.4,
  },
  
  // --- HEADER ---
  header: { textAlign: 'center', marginBottom: 5 },
  name: { fontSize: 24, fontFamily: 'Times-Bold', marginBottom: 10 },
  contactInfo: { flexDirection: 'row', justifyContent: 'center', gap: 5, fontSize: 10 },
  
  // --- SECTIONS ---
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 6,
  },
  
  // --- COMMON ROW STYLES ---
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  bold: { fontFamily: 'Times-Bold' },
  italic: { fontFamily: 'Times-Italic' },
  
  // --- LISTS ---
  bulletPoint: { flexDirection: 'row', marginBottom: 2, paddingLeft: 5 },
  bullet: { width: 10, fontSize: 10 },
  bulletContent: { flex: 1, fontSize: 11 },

  // --- SKILLS SPECIFIC ---
  skillRow: { flexDirection: 'row', marginBottom: 2 },
  skillLabel: { fontFamily: 'Times-Bold', width: 80 }, // Fixed width for alignment
});

export const ResumeDocument = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* 1. HEADER: Name + Contact Grid */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.name}</Text>
        <View style={styles.contactInfo}>
            <Text>{data.phone}</Text>
            <Text>|</Text>
            <Text>{data.email}</Text>
            <Text>|</Text>
            <Text>{data.linkedin}</Text>
            <Text>|</Text>
            <Text>{data.github}</Text>
        </View>
      </View>

      {/* 2. EDUCATION SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {data.education.map((edu, i) => (
          <View key={i} style={{ marginBottom: 4 }}>
            <View style={styles.row}>
              <Text style={styles.bold}>{edu.school}</Text>
              <Text>{edu.location}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.italic}>{edu.degree}</Text>
              <Text>{edu.year}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 3. EXPERIENCE SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {data.experience.map((job, i) => (
          <View key={i} style={{ marginBottom: 10 }} wrap={false}>
             {/* Company & Location */}
            <View style={styles.row}>
              <Text style={styles.bold}>{job.company}</Text>
              <Text>{job.date}</Text>
            </View>
            {/* Title */}
            <View style={styles.row}>
              <Text style={styles.italic}>{job.title}</Text>
              <Text>{job.location}</Text>
            </View>
            {/* Bullets */}
            {job.points.map((point, j) => (
              <View key={j} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletContent}>{point}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* 4. PROJECTS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {data.projects.map((proj, i) => (
          <View key={i} style={{ marginBottom: 10 }} wrap={false}>
            <View style={styles.row}>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                 <Text style={styles.bold}>{proj.name}</Text>
                 <Text style={styles.italic}>| {proj.technologies}</Text>
              </View>
            </View>
            {proj.points.map((point, j) => (
              <View key={j} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletContent}>{point}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* 5. TECHNICAL SKILLS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        
        <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>Languages:</Text>
            <Text>{data.skills.languages}</Text>
        </View>
        
        <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>Frameworks:</Text>
            <Text>{data.skills.frameworks}</Text>
        </View>
        
        <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>Developer Tools:</Text>
            <Text>{data.skills.tools}</Text>
        </View>

        <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>Libraries:</Text>
            <Text>{data.skills.libraries}</Text>
        </View>
      </View>

    </Page>
  </Document>
);