import React from 'react';
import { Phone, Mail, MapPin, Linkedin, Globe, Github, Award, Book, Briefcase, User } from 'lucide-react';

// Template 4: Peach & Black (Jordan Brown Style)
export const Template4 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg flex flex-col">
    {/* Header */}
    <div className="bg-rose-300 p-8 flex justify-between items-center text-white">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white">
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-3xl font-bold">
            {formData.personalInfo.fullName?.charAt(0) || 'J'}
          </div>
        </div>
        <h1 className="text-4xl font-bold">{formData.personalInfo.fullName || 'Jordan Brown'}</h1>
      </div>
      <div className="text-right text-sm">
        <p>{formData.personalInfo.address || 'Miami, FL'}</p>
        <p>{formData.personalInfo.phone || '(123) 456-7890'}</p>
        <p>{formData.personalInfo.email || 'jordanbrown@example.com'}</p>
      </div>
    </div>

    <div className="flex flex-1">
      {/* Left Black Sidebar */}
      <div className="w-7/12 bg-black text-white p-8 space-y-8">
        {/* Professional Experience */}
        <div>
          <h2 className="text-rose-300 text-xl font-bold mb-6 uppercase tracking-wider">Professional Experience</h2>
          <div className="space-y-6">
            {formData.experience.length > 0 ? formData.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg">{exp.title}</h3>
                <p className="text-rose-200 text-sm mb-2">{exp.company} | {exp.duration}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">Add your experience to see it here.</p>
            )}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-rose-300 text-xl font-bold mb-6 uppercase tracking-wider">Projects</h2>
          <div className="space-y-6">
            {formData.projects?.length > 0 ? formData.projects.map((proj, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg">{proj.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{proj.technologies}</p>
                {proj.link && <p className="text-rose-200 text-xs mb-1">{proj.link}</p>}
                <p className="text-gray-300 text-sm leading-relaxed">{proj.description}</p>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">Add your projects to see it here.</p>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h2 className="text-rose-300 text-xl font-bold mb-6 uppercase tracking-wider">Certifications</h2>
          <div className="space-y-4">
            {formData.certifications?.length > 0 ? formData.certifications.map((cert, index) => (
              <div key={index}>
                <h3 className="font-bold">{cert.name}</h3>
                <p className="text-rose-200 text-sm">{cert.issuer}</p>
                <p className="text-gray-400 text-sm">{cert.year}</p>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">Add your certifications to see it here.</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-rose-300 text-xl font-bold mb-6 uppercase tracking-wider">Education</h2>
          <div className="space-y-4">
            {formData.education.length > 0 ? formData.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-bold">{edu.institution}</h3>
                <p className="text-rose-200 text-sm">{edu.degree}</p>
                <p className="text-gray-400 text-sm">{edu.year}</p>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">Add your education to see it here.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right White Content */}
      <div className="w-5/12 bg-white p-8 border-l border-gray-100">
        <div className="text-right mb-8 text-sm font-bold text-gray-800">
          <p>WWW: LinkedIn | Portfolio</p>
        </div>

        {/* Key Skills */}
        <div>
          <h2 className="text-rose-300 text-xl font-bold mb-6 uppercase tracking-wider">Key Skills</h2>
          <div className="space-y-4">
            {formData.skills.length > 0 ? formData.skills.map((skill, index) => (
              <div key={index}>
                <p className="font-bold text-gray-800 text-sm mb-1">{skill}</p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-rose-300 h-2 rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">Add skills to see them here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Template 5: Modern Beige (Guada Fishe Style)
export const Template5 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg flex flex-col">
    {/* Dark Header */}
    <div className="bg-gray-800 text-white p-8 pb-16 relative">
      <div className="flex items-center gap-6 pl-32">
        <div>
          <h1 className="text-4xl font-light mb-1">{formData.personalInfo.fullName || 'Guada Fishe'}</h1>
          <p className="text-gray-300 text-lg">{formData.experience[0]?.title || 'Logistics Administrator'}</p>
        </div>
      </div>
      {/* Photo Circle Overlap */}
      <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 border-stone-100 overflow-hidden bg-yellow-600 z-10">
        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
          {formData.personalInfo.fullName?.charAt(0) || 'G'}
        </div>
      </div>
    </div>

    <div className="flex flex-1 mt-16">
      {/* Left Beige Sidebar */}
      <div className="w-1/3 bg-stone-100 p-8 pt-4 space-y-8 text-gray-700">
        {/* Contact */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> <span className="break-all">{formData.personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> <span>{formData.personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> <span>{formData.personalInfo.address}</span>
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Education</h2>
          <div className="space-y-4 border-l-2 border-gray-400 pl-4">
            {formData.education.map((edu, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-sm">{edu.degree}</h3>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
          <div className="space-y-2 text-sm">
            {formData.skills.map((skill, idx) => (
              <p key={idx} className="border-b border-gray-300 pb-1">{skill} - Expert</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8 pt-0 space-y-8">
        {/* Summary */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{formData.profileSummary || 'Experienced professional with a strong background in...'}</p>
        </div>

        {/* Work Experience */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Work Experience</h2>
          <div className="space-y-6">
            {formData.experience.map((exp, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900">{exp.title}, {exp.company}</h3>
                <p className="text-xs text-gray-500 mb-2">{exp.duration}</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Projects</h2>
          <div className="space-y-6">
            {formData.projects?.map((proj, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900">{proj.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{proj.technologies}</p>
                {proj.link && <a href={proj.link} className="text-xs text-blue-600 mb-2 block">View Project</a>}
                <p className="text-sm text-gray-700 whitespace-pre-line">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Certifications</h2>
          <div className="space-y-4">
            {formData.certifications?.map((cert, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.issuer} | {cert.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* References */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">References</h2>
          <p className="text-sm text-gray-600">References available upon request</p>
        </div>
      </div>
    </div>
  </div>
);

// Template 6: Red Sidebar (Sebastian Hurst Style)
export const Template6 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg flex">
    {/* Left Content */}
    <div className="w-2/3 p-8 pr-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-widest">{formData.personalInfo.fullName}</h1>
        <p className="text-orange-600 text-lg uppercase tracking-wider font-medium">{formData.experience[0]?.title}</p>
        <div className="flex gap-4 text-xs text-gray-500 mt-2">
          <span>{formData.personalInfo.phone}</span>
          <span>{formData.personalInfo.email}</span>
          <span>{formData.personalInfo.address}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-gray-500 font-bold tracking-widest uppercase mb-4 text-sm">Experience</h2>
        <div className="space-y-6">
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 border-orange-200 pl-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-800">{exp.title}</h3>
                <span className="text-xs text-gray-500">{exp.duration}</span>
              </div>
              <p className="text-orange-600 text-sm font-medium mb-2">{exp.company}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-gray-500 font-bold tracking-widest uppercase mb-4 text-sm">Projects</h2>
        <div className="space-y-6">
          {formData.projects?.map((proj, idx) => (
            <div key={idx} className="border-l-2 border-orange-200 pl-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-800">{proj.name}</h3>
                {proj.link && <a href={proj.link} className="text-xs text-orange-600">LINK</a>}
              </div>
              <p className="text-orange-600 text-sm font-medium mb-2">{proj.technologies}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-gray-500 font-bold tracking-widest uppercase mb-4 text-sm">Certifications</h2>
        <div className="space-y-4">
          {formData.certifications?.map((cert, idx) => (
            <div key={idx} className="border-l-2 border-orange-200 pl-4">
              <h3 className="font-bold text-gray-800">{cert.name}</h3>
              <p className="text-sm text-gray-500">{cert.issuer} • {cert.year}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-gray-500 font-bold tracking-widest uppercase mb-4 text-sm">Industry Expertise</h2>
        <div className="space-y-4">
          {formData.skills.slice(0, 4).map((skill, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-gray-700">{skill}</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full">
                <div className="bg-orange-600 h-1.5 rounded-full relative">
                  <div className="absolute -right-1 -top-1 w-3 h-3 bg-orange-800 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right Red Sidebar */}
    <div className="w-1/3 bg-red-900 text-white p-8">
      <div className="mb-10">
        <h2 className="text-red-200 font-bold tracking-widest uppercase mb-6 text-sm border-b border-red-800 pb-2">Education</h2>
        <div className="space-y-6">
          {formData.education.map((edu, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-white">{edu.degree}</h3>
              <p className="text-red-200 text-sm">{edu.institution}</p>
              <p className="text-red-300 text-xs mt-1">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-red-200 font-bold tracking-widest uppercase mb-6 text-sm border-b border-red-800 pb-2">Strengths</h2>
        <div className="space-y-4">
          {['Strategic Focus', 'Team Leadership', 'Data Analysis'].map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="mt-1"><Award className="w-4 h-4 text-white" /></div>
              <div>
                <h4 className="font-bold text-sm">{item}</h4>
                <p className="text-xs text-red-200 leading-tight mt-1">Proven track record in delivering results.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-red-200 font-bold tracking-widest uppercase mb-6 text-sm border-b border-red-800 pb-2">Languages</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>English</span> <span className="text-red-300">Native</span></div>
          <div className="flex justify-between"><span>Spanish</span> <span className="text-red-300">Proficient</span></div>
        </div>
      </div>
    </div>
  </div>
);

// Template 7: Dark Header Simple (William Jones Style)
export const Template7 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg flex flex-col">
    {/* Header */}
    <div className="bg-slate-800 text-white p-10 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">{formData.personalInfo.fullName}</h1>
        <p className="text-gray-300 text-sm mb-1">{formData.personalInfo.address} | {formData.personalInfo.phone}</p>
        <p className="text-gray-300 text-sm">{formData.personalInfo.email}</p>
      </div>
      <div className="w-24 h-24 rounded-full bg-gray-600 overflow-hidden border-2 border-gray-500">
        <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
          {formData.personalInfo.fullName?.charAt(0)}
        </div>
      </div>
    </div>

    <div className="p-10 space-y-8">
      {/* Summary */}
      <div className="text-sm text-gray-700 leading-relaxed font-medium">
        {formData.profileSummary || 'Certified professional seeking a position where I can utilize my skills...'}
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Education</h2>
        <div className="space-y-4">
          {formData.education.map((edu, idx) => (
            <div key={idx} className="flex gap-8">
              <div className="w-32 text-sm font-bold text-gray-600">{edu.year}</div>
              <div>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-sm text-gray-700">{edu.institution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Experience</h2>
        <div className="space-y-6">
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="flex gap-8">
              <div className="w-32 text-sm font-bold text-gray-600">{exp.duration}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                <p className="text-sm italic text-gray-600 mb-2">{exp.company}</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>{exp.description}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          {formData.skills.map((skill, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{skill}</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full">
                <div className="bg-slate-700 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Certifications</h2>
        <div className="space-y-4">
          {formData.certifications?.map((cert, idx) => (
            <div key={idx} className="flex gap-8">
              <div className="w-32 text-sm font-bold text-gray-600">{cert.year}</div>
              <div>
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <p className="text-sm text-gray-700">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Template 8: Academic Formal (IIIT Style)
export const Template8 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg p-12 font-serif">
    {/* Header */}
    <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 border border-black rounded-full flex items-center justify-center text-xs text-center font-bold">
          LOGO
        </div>
        <div>
          <h1 className="text-2xl font-bold uppercase">{formData.personalInfo.fullName}</h1>
          <p className="text-sm">Roll No: 12345678</p>
          <p className="text-sm">B.Tech, Computer Science</p>
          <p className="text-sm italic">Indian Institute of Information Technology</p>
        </div>
      </div>
      <div className="text-right text-sm">
        <p className="flex items-center justify-end gap-2"><Phone className="w-3 h-3" /> {formData.personalInfo.phone}</p>
        <p className="flex items-center justify-end gap-2"><Mail className="w-3 h-3" /> {formData.personalInfo.email}</p>
        <p className="flex items-center justify-end gap-2"><Linkedin className="w-3 h-3" /> LinkedIn Profile</p>
        <p className="flex items-center justify-end gap-2"><Github className="w-3 h-3" /> GitHub Profile</p>
      </div>
    </div>

    {/* Education Table */}
    <div className="mb-6">
      <h2 className="font-bold uppercase border-b border-gray-400 mb-2 text-sm">Education</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-1 font-bold">Degree / Certificate</th>
            <th className="text-left py-1 font-bold">Institute / Board</th>
            <th className="text-right py-1 font-bold">Year</th>
            <th className="text-right py-1 font-bold">CGPA/%</th>
          </tr>
        </thead>
        <tbody>
          {formData.education.map((edu, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-1">{edu.degree}</td>
              <td className="py-1">{edu.institution}</td>
              <td className="text-right py-1">{edu.year}</td>
              <td className="text-right py-1">{edu.gpa || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Experience */}
    <div className="mb-6">
      <h2 className="font-bold uppercase border-b border-gray-400 mb-2 text-sm">Experience</h2>
      <div className="space-y-4">
        {formData.experience.map((exp, idx) => (
          <div key={idx}>
            <div className="flex justify-between font-bold text-sm">
              <span>{exp.company}</span>
              <span className="italic font-normal">{exp.duration}</span>
            </div>
            <div className="flex justify-between text-sm italic mb-1">
              <span>{exp.title}</span>
              <span>{formData.personalInfo.address?.split(',')[0]}</span>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-800 pl-2">
              <li>{exp.description}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Projects */}
    <div className="mb-6">
      <h2 className="font-bold uppercase border-b border-gray-400 mb-2 text-sm">Projects</h2>
      <div className="space-y-3">
        {formData.projects?.length > 0 ? formData.projects.map((proj, idx) => (
          <div key={idx}>
            <div className="flex justify-between font-bold text-sm">
              <span>{proj.name}</span>
              <span className="italic font-normal">Jan 2023 - May 2023</span>
            </div>
            <p className="text-sm italic text-gray-600 mb-1">Tech Stack: React, Node.js, MongoDB</p>
            <ul className="list-disc list-inside text-sm text-gray-800 pl-2">
              <li>{proj.description || 'Developed a full-stack application...'}</li>
            </ul>
          </div>
        )) : (
          <p className="text-sm text-gray-500">Add projects to display them here.</p>
        )}
      </div>
    </div>

    {/* Certifications */}
    <div className="mb-6">
      <h2 className="font-bold uppercase border-b border-gray-400 mb-2 text-sm">Certifications</h2>
      <div className="space-y-3">
        {formData.certifications?.length > 0 ? formData.certifications.map((cert, idx) => (
          <div key={idx}>
            <div className="flex justify-between font-bold text-sm">
              <span>{cert.name}</span>
              <span className="italic font-normal">{cert.year}</span>
            </div>
            <p className="text-sm text-gray-600">{cert.issuer}</p>
          </div>
        )) : (
          <p className="text-sm text-gray-500">Add certifications to display them here.</p>
        )}
      </div>
    </div>

    {/* Technical Skills */}
    <div className="mb-6">
      <h2 className="font-bold uppercase border-b border-gray-400 mb-2 text-sm">Technical Skills</h2>
      <div className="text-sm grid grid-cols-[120px_1fr] gap-y-1">
        <span className="font-bold">Languages:</span>
        <span>C++, Python, JavaScript, Java</span>
        <span className="font-bold">Frameworks:</span>
        <span>React.js, Express.js, Django</span>
        <span className="font-bold">Tools:</span>
        <span>Git, VS Code, Postman, Docker</span>
      </div>
    </div>
  </div>
);

// Template 9: Minimalist (Clean & Airy)
export const Template9 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg p-16 flex flex-col items-center text-center">
    <div className="mb-12">
      <h1 className="text-5xl font-thin tracking-widest text-gray-900 mb-4 uppercase">{formData.personalInfo.fullName}</h1>
      <p className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase">{formData.experience[0]?.title}</p>
    </div>

    <div className="flex gap-6 text-xs font-medium text-gray-500 mb-16 uppercase tracking-wider">
      <span>{formData.personalInfo.email}</span>
      <span>•</span>
      <span>{formData.personalInfo.phone}</span>
      <span>•</span>
      <span>{formData.personalInfo.address}</span>
    </div>

    <div className="w-full max-w-lg text-left space-y-12">
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-200 pb-2">Profile</h2>
        <p className="text-sm text-gray-600 leading-loose">{formData.profileSummary}</p>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-200 pb-2">Experience</h2>
        <div className="space-y-8">
          {formData.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-bold text-gray-800 text-sm">{exp.company}</h3>
                <span className="text-xs text-gray-400">{exp.duration}</span>
              </div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{exp.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-200 pb-2">Projects</h2>
        <div className="space-y-8">
          {formData.projects?.map((proj, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-bold text-gray-800 text-sm">{proj.name}</h3>
                {proj.link && <a href={proj.link} className="text-xs text-gray-400 hover:text-gray-600">LINK</a>}
              </div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{proj.technologies}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-200 pb-2">Certifications</h2>
        <div className="space-y-4">
          {formData.certifications?.map((cert, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{cert.name}</h3>
                <p className="text-xs text-gray-500">{cert.issuer}</p>
              </div>
              <span className="text-xs text-gray-400">{cert.year}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-200 pb-2">Education</h2>
        <div className="space-y-4">
          {formData.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{edu.institution}</h3>
                <p className="text-xs text-gray-500">{edu.degree}</p>
              </div>
              <span className="text-xs text-gray-400">{edu.year}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

// Template 10: Tech Focused (Dark Mode Style)
export const Template10 = ({ formData }) => (
  <div className="bg-slate-900 min-h-[1056px] max-w-[816px] mx-auto shadow-lg text-slate-300 font-mono p-10">
    <div className="border border-slate-700 p-8 h-full">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-green-400 mb-2">{`> ${formData.personalInfo.fullName}_`}</h1>
          <p className="text-slate-400">
            <span className="text-purple-400">const</span> role = <span className="text-yellow-300">"{formData.experience[0]?.title}"</span>;
          </p>
        </div>
        <div className="text-right text-xs space-y-1 text-slate-500">
          <p>{formData.personalInfo.email}</p>
          <p>{formData.personalInfo.github}</p>
          <p>{formData.personalInfo.linkedin}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          <section>
            <h2 className="text-green-400 text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-400">01.</span> Experience
            </h2>
            <div className="space-y-6 border-l border-slate-800 pl-6">
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 bg-slate-900 border border-green-500 rounded-full"></div>
                  <h3 className="text-white font-bold">{exp.title} <span className="text-green-400">@ {exp.company}</span></h3>
                  <p className="text-xs text-slate-500 mb-2 font-mono">{exp.duration}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-green-400 text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-400">02.</span> Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {formData.projects?.map((proj, idx) => (
                <div key={idx} className="bg-slate-800/50 p-4 rounded border border-slate-700">
                  <h3 className="text-white font-bold text-sm mb-1">{proj.name}</h3>
                  <p className="text-xs text-slate-400">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-8">
          <section>
            <h2 className="text-green-400 text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-400">03.</span> Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-slate-800 text-xs text-green-300 rounded border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-green-400 text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-400">04.</span> Education
            </h2>
            <div className="space-y-4">
              {formData.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-white text-sm font-bold">{edu.institution}</h3>
                  <p className="text-xs text-slate-400">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-green-400 text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-400">05.</span> Certifications
            </h2>
            <div className="space-y-4">
              {formData.certifications?.map((cert, idx) => (
                <div key={idx}>
                  <h3 className="text-white text-sm font-bold">{cert.name}</h3>
                  <p className="text-xs text-slate-400">{cert.issuer}</p>
                  <p className="text-xs text-slate-500">{cert.year}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

// Template 11: Creative (Colorful & Bold)
export const Template11 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg overflow-hidden relative">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-32 -mb-32"></div>

    <div className="relative z-10 p-12 h-full flex flex-col">
      <header className="flex justify-between items-end mb-16 border-b-4 border-black pb-8">
        <div>
          <h1 className="text-6xl font-black text-black mb-2 tracking-tighter">
            {formData.personalInfo.fullName?.split(' ')[0]}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
              {formData.personalInfo.fullName?.split(' ')[1]}
            </span>
          </h1>
          <p className="text-xl font-bold text-gray-800">{formData.experience[0]?.title}</p>
        </div>
        <div className="text-right font-bold text-sm space-y-1">
          <p className="bg-black text-white px-2 inline-block">{formData.personalInfo.email}</p>
          <p>{formData.personalInfo.phone}</p>
          <p>{formData.personalInfo.address}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-16 flex-1">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">Ex</span>
              Experience
            </h2>
            <div className="space-y-8">
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="group">
                  <h3 className="text-xl font-bold group-hover:text-pink-600 transition-colors">{exp.title}</h3>
                  <p className="font-bold text-sm text-gray-500 mb-2">{exp.company} • {exp.duration}</p>
                  <p className="text-sm font-medium text-gray-800">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">Pr</span>
              Projects
            </h2>
            <div className="space-y-8">
              {formData.projects?.map((proj, idx) => (
                <div key={idx} className="group">
                  <h3 className="text-xl font-bold group-hover:text-pink-600 transition-colors">{proj.name}</h3>
                  <p className="font-bold text-sm text-gray-500 mb-2">{proj.technologies}</p>
                  <p className="text-sm font-medium text-gray-800">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm">Sk</span>
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {formData.skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 border-2 border-black rounded-full font-bold text-sm hover:bg-black hover:text-white transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm">Ed</span>
              Education
            </h2>
            <div className="space-y-6">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border-2 border-transparent hover:border-black transition-all">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <p className="text-sm font-medium text-gray-600">{edu.degree}</p>
                  <p className="text-xs font-bold text-gray-400 mt-1">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">Ce</span>
              Certifications
            </h2>
            <div className="space-y-6">
              {formData.certifications?.map((cert, idx) => (
                <div key={idx} className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="font-bold">{cert.name}</h3>
                  <p className="text-sm font-medium text-gray-600">{cert.issuer}</p>
                  <p className="text-xs font-bold text-gray-400 mt-1">{cert.year}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

// Template 12: Executive (Traditional Serif)
export const Template12 = ({ formData }) => (
  <div className="bg-stone-50 min-h-[1056px] max-w-[816px] mx-auto shadow-lg p-12 font-serif text-stone-900">
    <div className="text-center border-b-2 border-stone-300 pb-8 mb-8">
      <h1 className="text-4xl font-bold mb-3 tracking-wide text-stone-800">{formData.personalInfo.fullName}</h1>
      <div className="flex justify-center gap-4 text-sm italic text-stone-600">
        <span>{formData.personalInfo.address}</span>
        <span>•</span>
        <span>{formData.personalInfo.phone}</span>
        <span>•</span>
        <span>{formData.personalInfo.email}</span>
      </div>
    </div>

    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-stone-300 mb-4 pb-1">Professional Summary</h2>
        <p className="text-sm leading-relaxed text-justify">{formData.profileSummary}</p>
      </section>

      <section>
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-stone-300 mb-4 pb-1">Experience</h2>
        <div className="space-y-6">
          {formData.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-lg">{exp.company}</h3>
                <span className="text-sm italic">{exp.duration}</span>
              </div>
              <p className="text-stone-700 font-bold text-sm mb-2">{exp.title}</p>
              <p className="text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-stone-300 mb-4 pb-1">Projects</h2>
        <div className="space-y-6">
          {formData.projects?.map((proj, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-lg">{proj.name}</h3>
                {proj.link && <a href={proj.link} className="text-sm italic text-stone-600 hover:text-stone-900">Link</a>}
              </div>
              <p className="text-stone-700 font-bold text-sm mb-2">{proj.technologies}</p>
              <p className="text-sm leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-stone-300 mb-4 pb-1">Certifications</h2>
        <div className="space-y-4">
          {formData.certifications?.map((cert, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-stone-900">{cert.name}</h3>
                <span className="text-sm italic">{cert.year}</span>
              </div>
              <p className="text-stone-700 text-sm">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-stone-300 mb-4 pb-1">Education</h2>
          <div className="space-y-4">
            {formData.education.map((edu, idx) => (
              <div key={idx}>
                <h3 className="font-bold">{edu.institution}</h3>
                <p className="text-sm italic">{edu.degree}</p>
                <p className="text-sm text-stone-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-stone-300 mb-4 pb-1">Core Competencies</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {formData.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-stone-800 rounded-full"></span>
                {skill}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

// Template 13: Startup (Modern & Bold)
export const Template13 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg flex flex-col">
    <div className="bg-indigo-600 text-white p-12 rounded-bl-[4rem]">
      <h1 className="text-5xl font-bold mb-2">{formData.personalInfo.fullName}</h1>
      <p className="text-2xl text-indigo-200 font-light">{formData.experience[0]?.title}</p>

      <div className="flex gap-6 mt-8 text-sm font-medium">
        <div className="bg-indigo-500 px-4 py-2 rounded-lg">{formData.personalInfo.email}</div>
        <div className="bg-indigo-500 px-4 py-2 rounded-lg">{formData.personalInfo.phone}</div>
      </div>
    </div>

    <div className="p-12 grid grid-cols-3 gap-12 flex-1">
      <div className="col-span-2 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Experience</h2>
          <div className="space-y-8 relative border-l-2 border-indigo-100 pl-8 ml-3">
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[41px] top-1 w-5 h-5 bg-white border-4 border-indigo-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                <p className="text-indigo-600 font-medium mb-2">{exp.company}</p>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Projects</h2>
          <div className="space-y-8 relative border-l-2 border-indigo-100 pl-8 ml-3">
            {formData.projects?.map((proj, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[41px] top-1 w-5 h-5 bg-white border-4 border-indigo-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{proj.name}</h3>
                <p className="text-indigo-600 font-medium mb-2">{proj.technologies}</p>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Skills</h2>
          <div className="flex flex-col gap-3">
            {formData.skills.map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>{skill}</span>
                  <span className="text-indigo-600">85%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Education</h2>
          <div className="space-y-6">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="bg-indigo-50 p-4 rounded-xl">
                <h3 className="font-bold text-indigo-900">{edu.institution}</h3>
                <p className="text-sm text-indigo-700">{edu.degree}</p>
                <p className="text-xs text-indigo-500 mt-1 font-bold">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Certifications</h2>
          <div className="space-y-4">
            {formData.certifications?.map((cert, idx) => (
              <div key={idx} className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.issuer}</p>
                <p className="text-xs text-yellow-600 mt-1 font-bold">{cert.year}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);
