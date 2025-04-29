"use client"

import { pdf } from "@react-pdf/renderer"
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontStyle: "italic",
    },
  ],
})


// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Roboto",
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  contactItem: {
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    paddingBottom: 2,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  entrySubtitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  entryDate: {
    fontSize: 12,
    fontStyle: "italic",
  },
  entryDescription: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skill: {
    marginRight: 10,
    marginBottom: 5,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
})

// Create Resume Document
const ResumeDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header / Profile Section */}
      <View style={styles.header}>
      <Text style={styles.name}>{data.profile.name || "Your Name"}</Text>

      <View style={styles.contactInfo}>
        {data.profile.email && <Text style={styles.contactItem}>{data.profile.email}</Text>}
        {data.profile.phone && <Text style={styles.contactItem}>{data.profile.phone}</Text>}
        {data.profile.address && <Text style={styles.contactItem}>{data.profile.address}</Text>}
        {data.profile.linkedin && <Text style={styles.contactItem}>LinkedIn: {data.profile.linkedin}</Text>}
        {data.profile.github && <Text style={styles.contactItem}>GitHub: {data.profile.github}</Text>}
        {data.profile.portfolio && <Text style={styles.contactItem}>Portfolio: {data.profile.portfolio}</Text>}
      </View>

      {data.profile.summary && <Text style={styles.summary}>{data.profile.summary}</Text>}
      </View>
        {/* Education Section */}
        {data.education.some((edu) => edu.school || edu.degree) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) =>
            edu.school || edu.degree ? (
              <View key={index} style={{ marginBottom: 12 }}>
                {/* Top Row: School & Dates aligned */}
                <View style={styles.rowBetween}>
                  <Text style={styles.entryTitle}>{edu.school}</Text>
                  {(edu.startDate || edu.endDate) && (
                    <Text style={styles.entryDate}>
                      {edu.startDate} – {edu.endDate}
                    </Text>
                  )}
                </View>

                {/* Degree + Major */}
                <Text style={styles.entrySubtitle}>
                  {edu.degree}
                  {edu.major && ` in ${edu.major}`}
                </Text>

                {/* Minor */}
                {edu.minor && (
                  <Text style={styles.entrySubtitle}>Minor: {edu.minor}</Text>
                )}

                {/* GPA aligned right */}
                {edu.gpa && (
                  <View style={styles.rowBetween}>
                    <Text></Text> {/* spacer */}
                    <Text style={styles.entryDescription}>GPA: {edu.gpa}</Text>
                  </View>
                )}

                {/* Coursework */}
                {edu.coursework?.length > 0 && (
                  <Text style={styles.entryDescription}>
                    Relevant Coursework: {edu.coursework.join(", ")}
                  </Text>
                )}
              </View>
            ) : null
          )}
        </View>
      )}


      {/* Experience Section */}
      {data.experience.some((exp) => exp.company || exp.role) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp, index) =>
            exp.company || exp.role ? (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.entryTitle}>{exp.company}</Text>
                <Text style={styles.entrySubtitle}>{exp.role}</Text>

                <Text style={styles.entryDescription}>
                  {exp.location}
                </Text>

                <Text style={styles.entryDate}>
                  {exp.from} – {exp.currently ? "Present" : exp.to}
                </Text>

                {exp.summary && (
                  <Text style={styles.entryDescription}>{exp.summary}</Text>
                )}

                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={{ marginTop: 4, marginLeft: 12 }}>
                    {exp.bullets.map((bullet, i) => (
                      <Text key={i} style={styles.bulletPoint}>
                        • {bullet}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ) : null
          )}
        </View>
      )}


      {/* Projects Section */}
      {data.projects.some((proj) => proj.title) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects.map((proj, index) =>
            proj.title ? (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.entryTitle}>{proj.title}</Text>
                {proj.technologies && <Text style={styles.entrySubtitle}>Technologies: {proj.technologies}</Text>}
                {proj.description && <Text style={styles.entryDescription}>{proj.description}</Text>}
              </View>
            ) : null,
          )}
        </View>
      )}

      {/* Skills Section */}
      {data.skills.some((skill) => skill.name) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill, index) =>
              skill.name ? (
                <Text key={index} style={styles.skill}>
                  • {skill.name}
                </Text>
              ) : null,
            )}
          </View>
        </View>
      )}
    </Page>
  </Document>
)

export const generateResumePDF = async (resumeData) => {
  try {
    // Create the PDF blob
    const blob = await pdf(<ResumeDocument data={resumeData} />).toBlob()

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    return url
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
