import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

// interface ResumeData {
//   fullName: string;
//   email: string;
//   phone: string;
//   location: string;
//   linkedin: string;
//   portfolio: string;
//   summary: string;
//   experience: Array<{
//     company: string;
//     position: string;
//     duration: string;
//     description: string;
//   }>;
//   education: Array<{
//     school: string;
//     degree: string;
//     year: string;
//     gpa: string;
//   }>;
//   projects: Array<{
//     name: string;
//     technologies: string;
//     duration: string;
//     description: string;
//   }>;
//   skills: string;
//   certifications: string;
//   optimizedSkills?: string[];
// }

// interface ResumeTemplateProps {
//   data: ResumeData;
// }

export const ProfessionalTemplate = ({ data }) => (
  <div className="bg-white p-10" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>
    <div className="border-b-3 border-blue-600 pb-3 mb-4">
      <h1 className="font-bold text-gray-900 mb-1" style={{ fontSize: '24pt', lineHeight: '1.2' }}>{data.fullName}</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600" style={{ fontSize: '10pt' }}>
        {data.email && (
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span>{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{data.phone}</span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{data.location}</span>
          </div>
        )}
        {data.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="w-3 h-3" />
            <span>{data.linkedin}</span>
          </div>
        )}
        {data.portfolio && (
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>{data.portfolio}</span>
          </div>
        )}
      </div>
    </div>

    {data.summary && (
      <div className="mb-3">
        <h2 className="font-bold text-blue-600 mb-2 uppercase tracking-wide" style={{ fontSize: '14pt' }}>Professional Summary</h2>
        <p className="text-gray-700" style={{ fontSize: '11pt', lineHeight: '1.5' }}>{data.summary}</p>
      </div>
    )}

    {data.experience && data.experience.length > 0 && data.experience[0].company && (
      <div className="mb-3">
        <h2 className="font-bold text-blue-600 mb-2 uppercase tracking-wide" style={{ fontSize: '14pt' }}>Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-2.5">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{exp.position}</h3>
              <span className="text-gray-600" style={{ fontSize: '10pt' }}>{exp.duration}</span>
            </div>
            <p className="text-gray-700 font-semibold mb-1" style={{ fontSize: '10.5pt' }}>{exp.company}</p>
            <ul className="list-disc pl-4 text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
              {(exp.description).map((item, i) => (
                <li key={i}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {data.projects && data.projects.length > 0 && data.projects[0].name && (
      <div className="mb-3">
        <h2 className="font-bold text-blue-600 mb-2 uppercase tracking-wide" style={{ fontSize: '14pt' }}>Projects</h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-2.5">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{project.name}</h3>
              <span className="text-gray-600" style={{ fontSize: '10pt' }}>{project.duration}</span>
            </div>
            {project.technologies && (
              <p className="text-gray-700 font-semibold mb-1" style={{ fontSize: '10.5pt' }}>{project.technologies}</p>
            )}
            <ul className="list-disc pl-4 text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
              {project.description.map((item, i) => (
                <li key={i}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {data.education && data.education.length > 0 && data.education[0].school && (
      <div className="mb-3">
        <h2 className="font-bold text-blue-600 mb-2 uppercase tracking-wide" style={{ fontSize: '14pt' }}>Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{edu.degree}</h3>
                <p className="text-gray-700" style={{ fontSize: '10.5pt' }}>{edu.school}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600" style={{ fontSize: '10pt' }}>{edu.year}</p>
                {edu.gpa && <p className="text-gray-600" style={{ fontSize: '10pt' }}>GPA: {edu.gpa}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {data.optimizedSkills && data.optimizedSkills.length > 0 && (
      <div className="mb-3">
        <h2 className="font-bold text-blue-600 mb-2 uppercase tracking-wide" style={{ fontSize: '14pt' }}>Skills</h2>
        <p className="text-gray-700" style={{ fontSize: '10.5pt' }}>{data.optimizedSkills.join(' • ')}</p>
      </div>
    )}

    {data.certifications && (
      <div className="mb-3">
        <h2 className="font-bold text-blue-600 mb-2 uppercase tracking-wide" style={{ fontSize: '14pt' }}>Certifications</h2>
        <p className="text-gray-700" style={{ fontSize: '10.5pt' }}>{data.certifications}</p>
      </div>
    )}
  </div>
);

export const ModernTemplate = ({ data }) => (
  <div className="bg-white flex" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>
    <div className="w-1/3 bg-gradient-to-b from-purple-600 to-purple-800 p-6 text-white">
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ fontSize: '20pt', lineHeight: '1.2' }}>{data.fullName}</h1>
      </div>

      <div className="space-y-4">
        {data.email && (
          <div>
            <h3 className="uppercase tracking-wider font-semibold mb-1.5 text-purple-200" style={{ fontSize: '11pt' }}>Contact</h3>
            <div className="space-y-2" style={{ fontSize: '9.5pt' }}>
              <div className="flex items-start gap-1.5">
                <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="break-all">{data.email}</span>
              </div>
              {data.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{data.phone}</span>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>{data.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {(data.linkedin || data.portfolio) && (
          <div>
            <h3 className="uppercase tracking-wider font-semibold mb-1.5 text-purple-200" style={{ fontSize: '11pt' }}>Links</h3>
            <div className="space-y-2" style={{ fontSize: '9.5pt' }}>
              {data.linkedin && (
                <div className="flex items-center gap-1.5">
                  <Linkedin className="w-3 h-3 flex-shrink-0" />
                  <span className="break-all">{data.linkedin}</span>
                </div>
              )}
              {data.portfolio && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 flex-shrink-0" />
                  <span className="break-all">{data.portfolio}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {data.optimizedSkills && data.optimizedSkills.length > 0 && (
          <div>
            <h3 className="uppercase tracking-wider font-semibold mb-2 text-purple-200" style={{ fontSize: '11pt' }}>Skills</h3>
            <div className="space-y-1.5">
              {data.optimizedSkills.map((skill, index) => (
                <div key={index} className="bg-white bg-opacity-20 rounded px-2 py-1" style={{ fontSize: '9.5pt' }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications && (
          <div>
            <h3 className="uppercase tracking-wider font-semibold mb-1.5 text-purple-200" style={{ fontSize: '11pt' }}>Certifications</h3>
            <p style={{ fontSize: '9.5pt', lineHeight: '1.4' }}>{data.certifications}</p>
          </div>
        )}
      </div>
    </div>

    <div className="w-2/3 p-8">
      {data.summary && (
        <div className="mb-5">
          <h2 className="font-bold text-purple-600 mb-2" style={{ fontSize: '15pt' }}>Profile</h2>
          <p className="text-gray-700" style={{ fontSize: '11pt', lineHeight: '1.5' }}>{data.summary}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <div className="mb-5">
          <h2 className="font-bold text-purple-600 mb-2.5" style={{ fontSize: '15pt' }}>Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-3.5 relative pl-4 border-l-2 border-purple-200">
              <div className="absolute w-2 h-2 bg-purple-600 rounded-full -left-[5px] top-1"></div>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{exp.position}</h3>
                <span className="text-gray-500" style={{ fontSize: '10pt' }}>{exp.duration}</span>
              </div>
              <p className="text-purple-600 font-semibold mb-1" style={{ fontSize: '10.5pt' }}>{exp.company}</p>
              <ul className="list-disc pl-4 text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
                {(exp.description).map((item, i) => (
                  <li key={i}>{item.trim()}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <div className="mb-5">
          <h2 className="font-bold text-purple-600 mb-2.5" style={{ fontSize: '15pt' }}>Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3.5 relative pl-4 border-l-2 border-purple-200">
              <div className="absolute w-2 h-2 bg-purple-600 rounded-full -left-[5px] top-1"></div>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{project.name}</h3>
                <span className="text-gray-500" style={{ fontSize: '10pt' }}>{project.duration}</span>
              </div>
              {project.technologies && (
                <p className="text-purple-600 font-semibold mb-1" style={{ fontSize: '10.5pt' }}>{project.technologies}</p>
              )}
              <ul className="list-disc pl-4 text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
                {project.description.map((item, i) => (
                  <li key={i}>{item.trim()}</li>
                ))}
            </ul>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && data.education[0].school && (
        <div className="mb-5">
          <h2 className="font-bold text-purple-600 mb-2.5" style={{ fontSize: '15pt' }}>Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-2.5">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{edu.degree}</h3>
                  <p className="text-gray-700" style={{ fontSize: '10.5pt' }}>{edu.school}</p>
                </div>
                <div className="text-right" style={{ fontSize: '10pt' }}>
                  <p className="text-gray-600">{edu.year}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const CreativeTemplate = ({ data }) => (
  <div className="bg-white p-10" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>
    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 -m-10 mb-5 text-white">
      <h1 className="font-bold mb-2" style={{ fontSize: '24pt', lineHeight: '1.2' }}>{data.fullName}</h1>
      <div className="flex flex-wrap gap-4" style={{ fontSize: '10pt' }}>
        {data.email && (
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span>{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{data.phone}</span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{data.location}</span>
          </div>
        )}
        {data.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="w-3 h-3" />
            <span>{data.linkedin}</span>
          </div>
        )}
        {data.portfolio && (
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>{data.portfolio}</span>
          </div>
        )}
      </div>
    </div>

    {data.summary && (
      <div className="mb-4">
        <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold mb-2" style={{ fontSize: '11pt' }}>
          ABOUT ME
        </div>
        <p className="text-gray-700" style={{ fontSize: '11pt', lineHeight: '1.5' }}>{data.summary}</p>
      </div>
    )}

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        {data.experience && data.experience.length > 0 && data.experience[0].company && (
          <div>
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold mb-2.5" style={{ fontSize: '11pt' }}>
              EXPERIENCE
            </div>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-3 bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{exp.position}</h3>
                  <span className="text-gray-600 bg-white px-2 py-0.5 rounded-full" style={{ fontSize: '9.5pt' }}>
                    {exp.duration}
                  </span>
                </div>
                <p className="text-purple-600 font-semibold mb-1.5" style={{ fontSize: '10.5pt' }}>{exp.company}</p>
                <ul className="list-disc pl-4 text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
                  {(exp.description).map((item, i) => (
                    <li key={i}>{item.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.projects && data.projects.length > 0 && data.projects[0].name && (
          <div>
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold mb-2.5" style={{ fontSize: '11pt' }}>
              PROJECTS
            </div>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3 bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{project.name}</h3>
                  <span className="text-gray-600 bg-white px-2 py-0.5 rounded-full" style={{ fontSize: '9.5pt' }}>
                    {project.duration}
                  </span>
                </div>
                {project.technologies && (
                  <p className="text-purple-600 font-semibold mb-1.5" style={{ fontSize: '10.5pt' }}>{project.technologies}</p>
                )}
                <ul className="list-disc pl-4 text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
                  {project.description.map((item, i) => (
                    <li key={i}>{item.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.education && data.education.length > 0 && data.education[0].school && (
          <div>
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold mb-2.5" style={{ fontSize: '11pt' }}>
              EDUCATION
            </div>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-2.5 bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900" style={{ fontSize: '11pt' }}>{edu.degree}</h3>
                    <p className="text-gray-700" style={{ fontSize: '10.5pt' }}>{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600" style={{ fontSize: '10pt' }}>{edu.year}</p>
                    {edu.gpa && <p className="text-gray-600" style={{ fontSize: '10pt' }}>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {data.optimizedSkills && data.optimizedSkills.length > 0 && (
          <div>
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold mb-2.5" style={{ fontSize: '11pt' }}>
              SKILLS
            </div>
            <div className="space-y-1.5">
              {data.optimizedSkills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 border-l-2 border-purple-500 px-2.5 py-1.5 text-gray-800 font-medium rounded"
                  style={{ fontSize: '9.5pt' }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications && (
          <div>
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold mb-2.5" style={{ fontSize: '11pt' }}>
              CERTIFICATIONS
            </div>
            <p className="text-gray-700" style={{ fontSize: '10pt', lineHeight: '1.4' }}>{data.certifications}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const MinimalTemplate = ({ data }) => (
  <div className="bg-white p-10" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>
    <div className="text-center mb-5 pb-3 border-b border-gray-300">
      <h1 className="font-light text-gray-900 mb-2 tracking-tight" style={{ fontSize: '24pt', lineHeight: '1.2' }}>{data.fullName}</h1>
      <div className="flex justify-center flex-wrap gap-3 text-gray-600" style={{ fontSize: '10pt' }}>
        {data.email && <span>{data.email}</span>}
        {data.phone && (
          <>
            <span>|</span>
            <span>{data.phone}</span>
          </>
        )}
        {data.location && (
          <>
            <span>|</span>
            <span>{data.location}</span>
          </>
        )}
      </div>
      {(data.linkedin || data.portfolio) && (
        <div className="flex justify-center flex-wrap gap-3 text-gray-500 mt-1" style={{ fontSize: '10pt' }}>
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.portfolio && data.linkedin && <span>|</span>}
          {data.portfolio && <span>{data.portfolio}</span>}
        </div>
      )}
    </div>

    {data.summary && (
      <div className="mb-4">
        <p className="text-gray-700 text-center italic" style={{ fontSize: '11pt', lineHeight: '1.5' }}>{data.summary}</p>
      </div>
    )}

    {data.experience && data.experience.length > 0 && data.experience[0].company && (
      <div className="mb-4">
        <h2 className="uppercase tracking-widest font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-300" style={{ fontSize: '14pt' }}>
          Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="font-semibold text-gray-900" style={{ fontSize: '11pt' }}>{exp.position}</h3>
              <span className="text-gray-500 italic" style={{ fontSize: '10pt' }}>{exp.duration}</span>
            </div>
            <p className="text-gray-600 mb-1" style={{ fontSize: '10.5pt' }}>{exp.company}</p>
            <ul className="list-disc pl-4 text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
              {(exp.description).map((item, i) => (
                <li key={i}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {data.projects && data.projects.length > 0 && data.projects[0].name && (
      <div className="mb-4">
        <h2 className="uppercase tracking-widest font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-300" style={{ fontSize: '14pt' }}>
          Projects
        </h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="font-semibold text-gray-900" style={{ fontSize: '11pt' }}>{project.name}</h3>
              <span className="text-gray-500 italic" style={{ fontSize: '10pt' }}>{project.duration}</span>
            </div>
            {project.technologies && (
              <p className="text-gray-600 mb-1" style={{ fontSize: '10.5pt' }}>{project.technologies}</p>
            )}
            <ul className="list-disc pl-4 text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
              {project.description.map((item, i) => (
                <li key={i}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {data.education && data.education.length > 0 && data.education[0].school && (
      <div className="mb-4">
        <h2 className="uppercase tracking-widest font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-300" style={{ fontSize: '14pt' }}>
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-2.5">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-semibold text-gray-900" style={{ fontSize: '11pt' }}>{edu.degree}</h3>
                <p className="text-gray-600" style={{ fontSize: '10.5pt' }}>{edu.school}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 italic" style={{ fontSize: '10pt' }}>{edu.year}</p>
                {edu.gpa && <p className="text-gray-500" style={{ fontSize: '10pt' }}>GPA: {edu.gpa}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {data.optimizedSkills && data.optimizedSkills.length > 0 && (
      <div className="mb-4">
        <h2 className="uppercase tracking-widest font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-300" style={{ fontSize: '14pt' }}>
          Skills
        </h2>
        <p className="text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
          {data.optimizedSkills.join(' • ')}
        </p>
      </div>
    )}

    {data.certifications && (
      <div className="mb-4">
        <h2 className="uppercase tracking-widest font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-300" style={{ fontSize: '14pt' }}>
          Certifications
        </h2>
        <p className="text-gray-700" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>{data.certifications}</p>
      </div>
    )}
  </div>
);
