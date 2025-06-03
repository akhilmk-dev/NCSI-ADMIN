import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb2';
import CreatePublication from './CreatePublication'; // Your modal form for publications
import PublicationTable from './PublicationTable'; // Your table component for publications

const PublicationList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const publications = [
    {
      publicationId: 1,
      title: "React Best Practices",
      titleAr: "أفضل ممارسات React",
      coverImage: "https://example.com/react-cover.jpg",
      pdf: "https://example.com/react-best-practices.pdf",
      showInHome: true,
      classification: "Technology",
      type:"book"
    },
    {
      publicationId: 2,
      title: "Modern Web Design",
      titleAr: "تصميم الويب الحديث",
      coverImage: "https://example.com/web-design.jpg",
      pdf: null,
      showInHome: false,
      classification: "Design",
      type: "url"
    },
    {
      publicationId: 3,
      title: "AI Revolution",
      titleAr: "ثورة الذكاء الاصطناعي",
      coverImage: "https://example.com/ai-cover.jpg",
      pdf: "https://example.com/ai-revolution.pdf",
      showInHome: true,
      classification: "Science",
      type:"book"
    },
  ];

  const handleSubmit = (data) => {
    // Dispatch your addPublication action here
    // dispatch(addPublication(data))
    console.log("Submitted publication data:", data);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <CreatePublication visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center mx-3">
          <Breadcrumb
            title="Publications"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Publications', link: '#' },
            ]}
          />
          <Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> Add New
          </Button>
        </div>

        <PublicationTable loading={false} list={publications} />
      </div>
    </>
  );
};

export default PublicationList;
