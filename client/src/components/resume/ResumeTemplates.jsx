// Resume Templates Component
import React from 'react';
import { Phone, Mail, MapPin, Linkedin, Globe } from 'lucide-react';

// Template 1: Professional Single Column (Alexander Taylor Style)
export const Template1 = ({ formData }) => (
  <div
    className="bg-white p-12 min-h-[1056px] max-w-[816px] mx-auto shadow-lg"
    style={{ fontFamily: 'Georgia, serif' }}
  >
    {/* Header */}
    <div className="text-center mb-6 pb-4">
      <h1 className="text-3xl font-bold mb-1" style={{ letterSpacing: '0.5px' }}>
        {formData.personalInfo.fullName || 'YOUR NAME'}
      </h1>
      <div className="text-sm text-gray-600 space-x-2">
        <span>{formData.experience[0]?.title || 'Professional Title'}</span>
        <span>|</span>
        <span>{formData.skills.slice(0, 3).join(' | ') || 'Skills'}</span>
        <span>|</span>
        <span>Team Leadership</span>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {formData.personalInfo.email}
        {formData.personalInfo.linkedin && ` • ${formData.personalInfo.linkedin}`}
        {formData.personalInfo.address && ` • ${formData.personalInfo.address}`}
      </div>
    </div>

    {/* Summary */}
    {formData.profileSummary && (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 pb-1 border-b border-gray-800">PROFILE SUMMARY</h2>
        <p className="text-sm text-gray-700 leading-relaxed text-justify">{formData.profileSummary}</p>
      </div>
    )}

    {/* Experience */}
    {formData.experience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-800">WORK EXPERIENCE</h2>
        <div className="space-y-4">
          {formData.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <h3 className="font-bold text-sm">{exp.company}</h3>
                  <p className="text-sm italic">{exp.title}</p>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  <p>{exp.duration}</p>
                </div>
              </div>
              {exp.description && (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    {/* Projects */}
    {formData.projects && formData.projects.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-800">PROJECTS</h2>
        <div className="space-y-4">
          {formData.projects.map((proj, index) => (
            <div key={index}>
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <h3 className="font-bold text-sm">{proj.name}</h3>
                  <p className="text-sm italic">{proj.technologies}</p>
                </div>
                {proj.link && (
                  <div className="text-sm text-gray-600 text-right">
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a>
                  </div>
                )}
              </div>
              {proj.description && (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{proj.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Certifications */}
    {formData.certifications && formData.certifications.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-800">CERTIFICATIONS</h2>
        <div className="space-y-2">
          {formData.certifications.map((cert, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-bold text-sm">{cert.name}</p>
                <p className="text-sm text-gray-700">{cert.issuer}</p>
              </div>
              <div className="text-sm text-gray-600 text-right">
                <p>{cert.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {formData.skills.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 pb-1 border-b border-gray-800">SKILLS</h2>
        <p className="text-sm text-gray-700">{formData.skills.join(' • ')}</p>
      </div>
    )}

    {/* Education */}
    {formData.education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-800">EDUCATION</h2>
        <div className="space-y-2">
          {formData.education.map((edu, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-bold text-sm">{edu.institution}</p>
                <p className="text-sm text-gray-700">{edu.degree}</p>
              </div>
              <div className="text-sm text-gray-600 text-right">
                <p>{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Extra Sections */}
    {formData.extraSections && formData.extraSections.length > 0 && (
      <div className="mb-6">
        {formData.extraSections.map((section, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-800 uppercase">{section.title}</h2>
            <ul className="list-disc list-inside space-y-1">
              {section.items.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Template 2: Two Column with Avatar (Left Sidebar)
export const Template2 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg flex">
    {/* Left Sidebar */}
    <div className="w-1/3 bg-gray-50 p-8 border-r-4 border-teal-500">
      {/* Avatar Placeholder */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          {formData.personalInfo.fullName?.charAt(0) || 'Y'}
        </div>
      </div>

      {/* Contact */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 tracking-wide">CONTACT</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{formData.personalInfo.phone || '00-900-274'}</span>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="break-all">{formData.personalInfo.email || 'YOUREMAIL'}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{formData.personalInfo.address || '123 Main Street, Anytown'}</span>
          </div>
          <div className="flex items-start gap-2">
            <Linkedin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="break-all">{formData.personalInfo.linkedin || 'LINKEDIN.COM/'}</span>
          </div>
          {formData.personalInfo.github && (
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="break-all">{formData.personalInfo.github}</span>
            </div>
          )}
        </div>
      </div>

      {/* Education */}
      {formData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 tracking-wide">EDUCATION</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <p className="font-bold text-sm text-gray-800">{edu.degree}</p>
              <p className="text-sm text-gray-600">{edu.institution}</p>
              <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
              {edu.gpa && <p className="text-xs text-gray-500">(GPA: {edu.gpa})</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {formData.skills.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 tracking-wide">SKILLS</h2>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-2">PROFESSIONAL</p>
            <ul className="space-y-1">
              {formData.skills.map((skill, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>

    {/* Right Content */}
    <div className="w-2/3 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{formData.personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-xl text-gray-600">{formData.experience[0]?.title || 'Project Manager'}</p>
      </div>

      {/* Profile Summary */}
      {formData.profileSummary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-gray-800 tracking-wide border-l-4 border-teal-500 pl-3">
            PROFILE SUMMARY
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">{formData.profileSummary}</p>
        </div>
      )}

      {/* Work Experience */}
      {formData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-gray-800 tracking-wide border-l-4 border-teal-500 pl-3">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-5">
            {formData.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <p className="font-bold text-gray-800">{exp.title}</p>
                  <p className="text-sm text-gray-500">{exp.duration}</p>
                </div>
                <p className="text-sm text-gray-600 italic mb-2">{exp.company}</p>
                {exp.description && (
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {formData.projects && formData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-gray-800 tracking-wide border-l-4 border-teal-500 pl-3">
            PROJECTS
          </h2>
          <div className="space-y-5">
            {formData.projects.map((proj, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <p className="font-bold text-gray-800">{proj.name}</p>
                  {proj.link && (
                    <a href={proj.link} className="text-sm text-teal-600 hover:underline">View Project</a>
                  )}
                </div>
                <p className="text-sm text-gray-600 italic mb-2">{proj.technologies}</p>
                {proj.description && (
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{proj.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {formData.certifications && formData.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-gray-800 tracking-wide border-l-4 border-teal-500 pl-3">
            CERTIFICATIONS
          </h2>
          <div className="space-y-3">
            {formData.certifications.map((cert, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <p className="font-bold text-gray-800">{cert.name}</p>
                  <p className="text-sm text-gray-600">{cert.year}</p>
                </div>
                <p className="text-sm text-gray-600">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extra Sections */}
      {formData.extraSections && formData.extraSections.length > 0 && (
        <div className="mb-8">
          {formData.extraSections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-gray-800 tracking-wide border-l-4 border-teal-500 pl-3 uppercase">
                {section.title}
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  </div >
);

// Template 3: Modern Dark Sidebar
export const Template3 = ({ formData }) => (
  <div className="bg-white min-h-[1056px] max-w-[816px] mx-auto shadow-lg flex">
    {/* Left Dark Sidebar */}
    <div className="w-1/3 bg-slate-800 text-white p-8">
      {/* Avatar */}
      <div className="mb-8">
        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-6xl font-bold">
          {formData.personalInfo.fullName?.charAt(0) || 'R'}
        </div>
      </div>

      {/* Contact */}
      <div className="mb-8 pb-6 border-b border-slate-600">
        <h2 className="text-xl font-bold mb-4 tracking-wider">CONTACT</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 mt-1 text-teal-400 flex-shrink-0" />
            <span>{formData.personalInfo.phone || '+123-456-7890'}</span>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 mt-1 text-teal-400 flex-shrink-0" />
            <span className="break-all">{formData.personalInfo.email || 'hello@reallygreatsite.com'}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 mt-1 text-teal-400 flex-shrink-0" />
            <span>{formData.personalInfo.address || '123 Anywhere St., Any City'}</span>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-4 h-4 mt-1 text-teal-400 flex-shrink-0" />
            <span className="break-all">{formData.personalInfo.github || 'www.reallygreatsite.com'}</span>
          </div>
        </div>
      </div>

      {/* Education */}
      {formData.education.length > 0 && (
        <div className="mb-8 pb-6 border-b border-slate-600">
          <h2 className="text-xl font-bold mb-4 tracking-wider">EDUCATION</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm font-semibold">{edu.year}</p>
              <p className="font-bold text-sm mt-1">{edu.institution?.toUpperCase()}</p>
              <p className="text-sm opacity-90">{edu.degree}</p>
              {edu.gpa && <p className="text-xs opacity-75 mt-1">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {formData.skills.length > 0 && (
        <div className="mb-8 pb-6 border-b border-slate-600">
          <h2 className="text-xl font-bold mb-4 tracking-wider">SKILLS</h2>
          <ul className="space-y-2 text-sm">
            {formData.skills.map((skill, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      <div>
        <h2 className="text-xl font-bold mb-4 tracking-wider">LANGUAGES</h2>
        <ul className="space-y-2 text-sm">
          {formData.languages?.map((lang, index) => (
            <li key={index}>{lang}</li>
          ))}
        </ul>
      </div>
    </div>

    {/* Right Content */}
    <div className="w-2/3 p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900">
          {formData.personalInfo.fullName?.split(' ')[0]?.toUpperCase() || 'RICHARD'}{' '}
          <span className="font-light">{formData.personalInfo.fullName?.split(' ')[1]?.toUpperCase() || 'SANCHEZ'}</span>
        </h1>
        <div className="mt-2 flex items-center">
          <div className="h-1 w-12 bg-teal-500"></div>
          <p className="text-lg text-gray-700 ml-4 tracking-wider">{formData.experience[0]?.title?.toUpperCase() || 'MARKETING MANAGER'}</p>
        </div>
      </div>

      {/* Profile */}
      {formData.profileSummary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-gray-800 tracking-wider pb-2 border-b-2 border-gray-300">
            PROFILE
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">{formData.profileSummary}</p>
        </div>
      )}

      {/* Work Experience */}
      {formData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-800 tracking-wider pb-2 border-b-2 border-gray-300">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={index} className="relative pl-6">
                <div className="absolute left-0 top-2 w-3 h-3 bg-slate-800 rounded-full"></div>
                <div className="flex justify-between mb-1">
                  <p className="font-bold text-gray-900">{exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.duration}</p>
                </div>
                <p className="text-sm text-gray-600 italic mb-2">{exp.title}</p>
                {exp.description && (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {formData.projects && formData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-800 tracking-wider pb-2 border-b-2 border-gray-300">
            PROJECTS
          </h2>
          <div className="space-y-6">
            {formData.projects.map((proj, index) => (
              <div key={index} className="relative pl-6">
                <div className="absolute left-0 top-2 w-3 h-3 bg-slate-800 rounded-full"></div>
                <div className="flex justify-between mb-1">
                  <p className="font-bold text-gray-900">{proj.name}</p>
                  {proj.link && (
                    <a href={proj.link} className="text-xs text-teal-600 uppercase tracking-wider font-bold">LINK</a>
                  )}
                </div>
                <p className="text-sm text-gray-600 italic mb-2">{proj.technologies}</p>
                {proj.description && (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{proj.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {formData.certifications && formData.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 text-gray-800 tracking-wider pb-2 border-b-2 border-gray-300">
            CERTIFICATIONS
          </h2>
          <div className="space-y-2">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="text-sm">
                <p className="font-bold text-gray-800">{cert.name}</p>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extra Sections */}
      {formData.extraSections && formData.extraSections.length > 0 && (
        <div className="mt-8">
          {formData.extraSections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-gray-800 tracking-wider pb-2 border-b-2 border-gray-300 uppercase">
                {section.title}
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
